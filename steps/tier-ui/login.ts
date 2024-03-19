import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.TIER_UI_URL)
    await page.getByLabel('Username').fill(process.env.DELIUS_USERNAME!)
    await page.getByLabel('Password').fill(process.env.DELIUS_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveTitle('Tier - Home')
}
