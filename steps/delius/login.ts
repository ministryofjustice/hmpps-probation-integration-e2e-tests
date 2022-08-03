import { Page, expect } from "@playwright/test";

export const login = async (page: Page) => {
    await page.goto(process.env.DELIUS_URL)
    const deliusTitle = "National Delius Home Page"
    const title = await page.locator("title").textContent()

    //may already be logged in
    if(title == deliusTitle) {
        page.on('dialog', dialog => dialog.accept());
        await page.locator('//a[contains(@title, "Select this option to exit from the Delius application")]').click()
    }

    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill("id=username", process.env.DELIUS_USERNAME!!)
    await page.fill("id=password", process.env.DELIUS_PASSWORD!!)
    await page.click("id=submit")
    await expect(page).toHaveTitle(deliusTitle)
}
