import { type Page, expect } from '@playwright/test'

export const logout = async (page: Page) => {
    await page.goto(process.env.DELIUS_URL)
    const deliusTitle = 'National Delius Home Page'
    const title = await page.locator('title').textContent()

    // may already be logged in
    if (title == deliusTitle) {
        page.once('dialog', dialog => dialog.accept())
        await page.locator('//a[contains(@title, "Select this option to exit from the Delius application")]').click()
    }

    await expect(page).toHaveTitle(/Exit NDelius/)
    await page.click('body > div > a')
    await expect(page).toHaveTitle(/National Delius - Login/)
}
