import { expect, type Page } from '@playwright/test'

export const confirmYourDetails = async (page: Page) => {
    await page.getByLabel('Yes').click()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText(/do they have a transgender history?/)
}
