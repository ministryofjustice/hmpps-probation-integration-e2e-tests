import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.DELIUS_URL)
    const deliusTitle = 'National Delius Home Page'
    const title = await page.locator('title').textContent()

    //may already be logged in
    if (title == deliusTitle) {
        page.once('dialog', dialog => dialog.accept())
        await page.locator('//a[contains(@title, "Select this option to exit from the Delius application")]').click()
    }

    await expect(page).toHaveTitle(/National Delius - Login/)
    await page.fill('#j_username', process.env.DELIUS_USERNAME!)
    await page.fill('#j_password', process.env.DELIUS_PASSWORD!)
    await page.locator('.btn-success', { hasText: 'Login' }).click()
    await expect(page).toHaveTitle(deliusTitle)
}
