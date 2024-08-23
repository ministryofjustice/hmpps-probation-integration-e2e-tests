import { login } from '../../steps/delius/login'
import { login as workforceLogin } from '../../steps/workforce/login'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { data } from '../../test-data/test-data'
import { chromium, expect, Page, test } from '@playwright/test'
import { slow } from '../../steps/common/common'
import { refreshUntil } from '../../steps/delius/utils/refresh.js'

test('Allocate unallocated workforce crns in delius', async ({ page }) => {
    slow()
    await allocateCases(page, 100)
})

export const allocateCases = async (page: Page, number: number) => {
    await workforceLogin(page)
    await refreshUntil(page, () => expect(page.locator("[href$='find-unallocated']")).toBeVisible())
    await page.getByRole('button', { name: /View unallocated cases/ }).click()
    await refreshUntil(page, () => expect(page).toHaveTitle(/.*Unallocated cases.*/))
    await expect(page).toHaveTitle(/.*Unallocated cases.*/)
    await page.locator('[data-persistent-id="find-unallocated-cases-sentence-date"]').click()
    const browser = await chromium.launch()
    const deliusPage = await browser.newPage()
    await login(deliusPage)

    for (let i = 1; i <= number; i++) {
        const crn = await page.locator(`#main-content table tr:nth-child(${i}) td:first-child span`).textContent()
        console.log('crn from workforce is ' + crn)

        try {
            await internalTransfer(deliusPage, {
                crn,
                allocation: { staff: data.staff.allocationsTester2, team: data.teams.allocationsTestTeam },
            })
        } catch (error) {
            console.error(`Error occurred during internal transfer: ${error}`)
        }
    }
}
