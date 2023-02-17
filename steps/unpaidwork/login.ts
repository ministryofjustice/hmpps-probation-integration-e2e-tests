import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    const unpaidWorkTitle = 'Complete and download the Community payback assessment'
    const title = await page.locator('title').textContent()

    //may already be logged in
    if (title.trim() == unpaidWorkTitle) {
        page.once('dialog', dialog => dialog.accept())
        await page.locator('a', { hasText: 'Sign out' }).click()
    }

    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle(unpaidWorkTitle)
    await page.locator('.govuk-button', { hasText: 'Start now' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
