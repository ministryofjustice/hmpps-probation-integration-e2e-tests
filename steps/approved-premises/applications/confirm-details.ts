import { type Page, expect } from '@playwright/test'

export const clickSaveAndContinue = async (page: Page) => {
    await page.locator('.govuk-button',{ hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('This application is not eligible')
}
