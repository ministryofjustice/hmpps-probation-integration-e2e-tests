import { expect, type Page } from '@playwright/test'
export const login = async (page: Page) => {
    await page.goto(process.env.TIER_UI_URL)
    const tierUiTitle = 'Tier - Home'

    await page.fill('#username', process.env.TIER_UI_USERNAME!)
    await page.fill('#password', process.env.TIER_UI_PASSWORD!)
    await page.locator('#submit', { hasText: 'Sign in' }).click()
    await expect(page).toHaveTitle(tierUiTitle)
}
