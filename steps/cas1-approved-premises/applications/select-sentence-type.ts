import { type Page, expect } from '@playwright/test'

export const selectSentenceType = async (page: Page) => {
    await page.getByLabel('Community Order').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('What is the reason for placing this person in an AP?')
}
