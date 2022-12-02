import { type Page, expect } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.REFERANDMONITOR_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(/.*HMPPS Interventions - Referral - Referrals/)
}

export const loginAsSupplier = async (page: Page) => {
    await page.goto(process.env.REFERANDMONITOR_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.REFERANDMONITOR_SUPPLIER_USERNAME!)
    await page.fill('#password', process.env.REFERANDMONITOR_SUPPLIER_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(/HMPPS Interventions/)
}

export const logoutSupplier = async (page: Page) => {
    await page.goto(process.env.REFERANDMONITOR_URL)
    await expect(page).toHaveTitle(/HMPPS Interventions/)
    await page.locator('a', { hasText: 'Sign out' }).click()
}

