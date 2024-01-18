import { type Page, expect } from '@playwright/test'

export const selectSituationOption = async (page: Page) => {
    await page.getByLabel('Application for risk management/public protection').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText(/release date?/)
}
