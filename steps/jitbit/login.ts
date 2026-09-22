import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.JITBIT_DELIUS_URL)
    // await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.JITBIT_USERNAME!)
    await page.fill('#password', process.env.JITBIT_PASSWORD!)
    await page.click('#submit')
    // await expect(page).toHaveTitle(/Case list - Find and manage accommodation/)
}
