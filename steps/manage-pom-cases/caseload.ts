import { expect, type Page } from '@playwright/test'
import { selectOption } from '../delius/utils/inputs'

export const switchCaseload = async (page: Page, caseload: string) => {
    await page.locator('[data-test="change-case-load-link"]').click()
    await selectOption(page, '#changeCaseloadSelect', caseload)
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.goto(process.env.MANAGE_POM_CASES_URL)
    await expect(page).toHaveTitle('POM caseload dashboard – Digital Prison Services')
}
