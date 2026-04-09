import { type Page } from '@playwright/test'

export const switchCaseload = async (page: Page, caseload: string) => {
    await page.locator('[data-qa="cdps-header-caseload"]').click()
    await page.getByLabel('Select an establishment').selectOption(caseload)
    await page.getByRole('button', { name: 'Submit' }).click()
}
