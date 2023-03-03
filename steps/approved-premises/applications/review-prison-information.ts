import { type Page, expect } from '@playwright/test'

export const reviewPrisoninformation = async (page: Page) => {
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click();
    await expect(page.locator('#prison-information-status')).toHaveText("Completed")
}
