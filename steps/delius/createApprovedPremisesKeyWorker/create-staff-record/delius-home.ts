import { expect, type Page } from '@playwright/test'

export const clickReferenceData = async (page: Page) => {
    await page.locator('a', { hasText: 'Reference Data' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Reference Data')
}
