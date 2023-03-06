import { type Page, expect } from '@playwright/test'

export const selectSituationOption = async (page: Page) => {
    await page.getByLabel('Referral for risk management').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText(/release date?/)
}
