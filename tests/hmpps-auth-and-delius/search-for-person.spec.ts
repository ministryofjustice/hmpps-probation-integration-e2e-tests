import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'

dotenv.config() // read environment variables into process.env

test('Sign in and check user details', async ({ page }) => {
    await page.goto(`${process.env.AUTH_URL}/auth/sign-in`)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(/HMPPS Digital Services - Home/)
    await page.locator('[data-test="manage-account-link"]').click()
    await expect(page.locator('[data-qa="email"]')).toContainText('simulate-delivered@notifications.service.gov.uk')
})
