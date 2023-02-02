import { type Page, expect } from '@playwright/test'

export const clickExceptionalCaseYes = async (page: Page) => {
    await page.locator('#isExceptionalCase').click()
    await page.locator('button', { hasText: 'Submit' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Provide details for exemption application')
}
