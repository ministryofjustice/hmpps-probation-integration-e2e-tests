import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await page.goto(process.env.JITBIT_DELIUS_URL)
    await expect(page).toHaveTitle('JitBit (Sandbox) - Knowledge base')
    await page.getByRole('link', { name: 'sign in' }).click()
    await page.fill('#Username', process.env.JITBIT_USERNAME!)
    await page.fill('#Password', process.env.JITBIT_PASSWORD!)
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveTitle('JitBit (Sandbox)')
}
