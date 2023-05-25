import { type Page, expect } from '@playwright/test'

export const selectTransgenderStatus = async (page: Page) => {
    await page.locator('#transgenderOrHasTransgenderHistory-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('.govuk-fieldset__heading')).toHaveText(
        'Which of the following best describes the sentence type the person is on?'
    )
}