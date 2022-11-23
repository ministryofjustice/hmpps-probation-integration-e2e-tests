import { expect, type Page } from '@playwright/test'
import * as dotenv from 'dotenv'

export const login = async (page: Page) => {
    await page.goto(process.env.APPROVEDPREMISES_URL)
    const approvedPremisesTitle = 'Approved Premises - Home'
    const title = await page.locator('title').textContent()

    //may already be logged in
    if (title.trim() == approvedPremisesTitle) {
        page.once('dialog', dialog => dialog.accept())
        await page.locator('a', { hasText: 'Sign out' }).click()
    }

    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.APPROVEDPREMISES_USERNAME!)
    await page.fill('#password', process.env.APPROVEDPREMISES_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(approvedPremisesTitle)
}