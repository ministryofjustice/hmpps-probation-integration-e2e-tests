import { expect, type Page } from '@playwright/test'

export const logout = async (page: Page) => {
    const title = await page.locator('title').textContent()
    await expect(page).toHaveTitle(title)
}
