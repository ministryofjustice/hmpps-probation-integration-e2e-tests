import { expect, type Page } from '@playwright/test'

export const clickLocalReferenceRecords = async (page: Page) => {
    await page.locator('a', { hasText: 'Local Reference Records' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Local Reference Data')
}
