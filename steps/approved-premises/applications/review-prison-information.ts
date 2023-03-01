import { type Page, expect } from '@playwright/test'


export const reviewPrisoninformation = async (page: Page) => {
    // await page.locator('button', { hasText: 'Save and continue' }).click();
    await page.locator('.govuk-button').click();
    await expect(page.locator('#prison-information-status')).toHaveText("Completed")
}
