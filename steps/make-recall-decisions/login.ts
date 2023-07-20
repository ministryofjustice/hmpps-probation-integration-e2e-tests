import { type Page, expect } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.CONSIDER_A_RECALL_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME)
    await page.fill('#password', process.env.DELIUS_PASSWORD)
    await page.click('#submit')
    await expect(page).toHaveTitle('Start page - Consider a recall')
}

export const loginAsSupervisor = async (page: Page) => {
    await page.goto(process.env.CONSIDER_A_RECALL_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.CONSIDER_A_RECALL_MRD_USERNAME)
    await page.fill('#password', process.env.CONSIDER_A_RECALL_MRD_PASSWORD)
    await page.click('#submit')
    await expect(page).toHaveTitle('Start page - Consider a recall')
}

export const logout = async (page: Page) => {
    await page.locator('a', { hasText: 'Sign out' }).click()
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
}
