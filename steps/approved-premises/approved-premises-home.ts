import { type Page, expect } from '@playwright/test'

export const selectApprovedPremises = async (page: Page) => {
    await page.locator('tr' , {hasText: 'Bedford AP'}).locator('a' , {hasText: 'View'}).click()
    await expect(page.locator('.moj-identity-bar__title > h1')).toHaveText('Bedford AP')
}
