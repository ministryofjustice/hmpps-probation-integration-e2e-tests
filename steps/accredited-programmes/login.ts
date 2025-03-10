import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.ACCREDITED_PROGRAMMES_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DPS_USERNAME!)
    await page.fill('#password', process.env.DPS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(/Accredited Programmes/)
}
