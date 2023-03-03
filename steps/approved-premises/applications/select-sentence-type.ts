import { type Page, expect } from '@playwright/test'

export const selectSentenceType = async (page: Page) => {
    await page.getByLabel('Community Order').check()
    await page.locator('button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'Which of the following options best describes the situation?'
    )
}
