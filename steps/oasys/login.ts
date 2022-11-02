import { type Page, expect } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.OASYS_URL)
    await expect(page.locator('#loginbodyheader > h2')).toHaveText('Login')
    await page.fill('#P101_USERNAME', process.env.OASYS_USERNAME!)
    await page.fill('#P101_PASSWORD', process.env.OASYS_PASSWORD!)
    await page.click('#P101_LOGIN_BTN')
    await expect(page.locator('#loginbodyheader > h2')).toHaveText('Provider/Establishment')
}
