import { login as deliusLogin } from '../../steps/delius/login'
import { login as workforceLogin } from '../../steps/workforce/login'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { data } from '../../test-data/test-data'
import { chromium, expect, test } from '@playwright/test'
import { slow } from '../../steps/common/common'
import { refreshUntil } from '../../steps/delius/utils/refresh.js'

test('Allocate unallocated workforce CRNs in Delius', async ({ page }) => {
    slow()

    const maxNumberOfCasesToAllocate = 100
    const minNumberOfCasesToLeaveUnallocated = 50

    await workforceLogin(page)

    // Navigate to the unallocated cases page
    await page.getByRole('button', { name: /View unallocated cases/ }).click()
    await refreshUntil(page, () => expect(page).toHaveTitle(/.*Unallocated cases.*/))

    // Retrieve and parse the number of unallocated cases
    const unallocatedCount = await page.locator('table[data-persistent-id=find-unallocated-cases] tbody tr').count()
    if (unallocatedCount <= minNumberOfCasesToLeaveUnallocated) {
        console.log(`Number of unallocated cases is ${unallocatedCount}. Allocation will not proceed.`)
        return
    }
    const numberOfCasesToAllocate = Math.min(
        unallocatedCount - minNumberOfCasesToLeaveUnallocated,
        maxNumberOfCasesToAllocate
    )
    console.log(`Preparing to allocate ${numberOfCasesToAllocate} cases`)

    const browser = await chromium.launch()
    const deliusPage = await browser.newPage()
    await deliusLogin(deliusPage)

    for (let i = 1; i <= numberOfCasesToAllocate; i++) {
        const crn = await page
            .locator(
                `table[data-persistent-id=find-unallocated-cases] tbody tr:nth-child(${i}) td:first-child div:nth-child(2)`
            )
            .textContent()
        console.log(`Allocating case: ${crn}`)

        try {
            await internalTransfer(deliusPage, {
                crn,
                allocation: { staff: data.staff.allocationsTester2, team: data.teams.allocationsTestTeam },
            })
        } catch (error) {
            console.error(`Error occurred during internal transfer: ${error}. Continuing...`)
        }
    }
    await browser.close()
})
