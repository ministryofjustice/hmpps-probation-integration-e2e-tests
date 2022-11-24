import { expect, type Page } from '@playwright/test'

export const clickStaffButton = async (page: Page) => {
    await page.locator('input', { hasText: 'Staff' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')
}
