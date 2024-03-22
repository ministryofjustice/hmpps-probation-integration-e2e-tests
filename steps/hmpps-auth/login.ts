import { type Page, expect } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(`${process.env.AUTH_URL}/auth/sign-in`)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.getByLabel('Username').fill(process.env.DELIUS_USERNAME!)
    await page.getByLabel('Password').fill(process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
}
