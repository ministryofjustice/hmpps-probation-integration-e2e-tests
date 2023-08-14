import { type Page } from '@playwright/test'

export const switchCaseload = async (page: Page, caseload: string) => {
    await page.locator('[data-test="change-location-link"]').click()
    await page.getByLabel('Select active case load').selectOption(caseload)
    await page.getByRole('button', { name: 'Submit' }).click()
}
