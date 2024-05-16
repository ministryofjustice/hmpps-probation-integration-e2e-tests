import { type Page, expect } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.CVL_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(/Create and vary a licence - Home/)
}

export const loginAsPrisonOfficer = async (page: Page) => {
    await page.goto(process.env.CVL_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DPS_USERNAME!)
    await page.fill('#password', process.env.DPS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(/Create and vary a licence - Home/)
}
