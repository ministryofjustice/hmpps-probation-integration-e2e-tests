import { type Page, expect } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.WORKFORCE_URL)
    await expect(page).toHaveTitle(/.*Manage a workforce/)
}
