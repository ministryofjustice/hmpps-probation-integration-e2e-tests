import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.DELIUS_URL)
    const deliusTitle = 'National Delius Home Page'
    const title = await page.locator('title').textContent()

    // may already be logged in
    if (title == deliusTitle) {
        return
    }

    await expect(page).toHaveTitle(/National Delius - Login/)
    await page.fill('#j_username', process.env.DELIUS_USERNAME!)
    await page.fill('#j_password', process.env.DELIUS_PASSWORD!)
    await page.locator('.btn-primary', { hasText: 'Login' }).click()
    await expect(page).toHaveTitle(deliusTitle)
}
