import { login as deliusLogin } from '../../steps/delius/login'
import { login as workforceLogin } from '../../steps/workforce/login'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { data } from '../../test-data/test-data'
import { chromium, expect, Page, test } from '@playwright/test'
import { slow } from '../../steps/common/common'
import { refreshUntil } from '../../steps/delius/utils/refresh.js'

test('Allocate unallocated workforce CRNs in Delius', async ({ page }) => {
    slow()

    const minimumToLeaveUnallocated = 50
    const maximumToAllocate = 50

    // Navigate to the unallocated cases page
    await workforceLogin(page)
    await page.getByRole('button', { name: /View unallocated cases/ }).click()
    await refreshUntil(page, () => expect(page).toHaveTitle(/.*Unallocated cases.*/))

    // Retrieve and parse the number of unallocated cases
    const unallocatedText = await page.getByText(/Unallocated cases \(\d+\+?\)/).textContent()
    const unallocatedCount = parseInt(unallocatedText.match(/\d+/)[0], 10)

    if (unallocatedCount > minimumToLeaveUnallocated) {
        const casesToAllocate = Math.min(unallocatedCount - minimumToLeaveUnallocated, maximumToAllocate)
        console.log(`Allocating ${casesToAllocate} of ${unallocatedCount} cases`)

        const browser = await chromium.launch()
        const deliusPage = await browser.newPage()
        await deliusLogin(deliusPage)

        for (let i = 1; i <= Math.min(unallocatedCount - minimumToLeaveUnallocated, maximumToAllocate); i++) {
            const crn = await page.locator(`#main-content table tr:nth-child(${i}) td:first-child span`).textContent()
            console.log('CRN from workforce is ' + crn)

            try {
                await internalTransfer(deliusPage, {
                    crn,
                    allocation: { staff: data.staff.allocationsTester2, team: data.teams.allocationsTestTeam },
                })
            } catch (error) {
                console.error(`Error occurred during internal transfer: ${error}`)
            }
        }
        await browser.close()
    } else {
        console.log(`Number of unallocated cases is ${unallocatedCount}. Allocation will not proceed.`)
    }
})
