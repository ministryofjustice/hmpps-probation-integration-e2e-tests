import { type Page, expect } from '@playwright/test'

export const selectTransgenderStatus = async (page: Page) => {
    await page.locator('#transgenderOrHasTransgenderHistory-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Which of the following dates are relevant?')
}

export const enterSedLedPssDates = async (page: Page) => {
    await page.locator('#sedDate-day').fill('27')
    await page.locator('#sedDate-month').fill('03')
    await page.locator('#sedDate-year').fill('2024')
    await page.locator('#ledDate-day').fill('27')
    await page.locator('#ledDate-month').fill('03')
    await page.locator('#ledDate-year').fill('2024')
    await page.locator('#pssDate-day').fill('27')
    await page.locator('#pssDate-month').fill('03')
    await page.locator('#pssDate-year').fill('2024')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('.govuk-fieldset__heading')).toHaveText(
        'Which of the following best describes the sentence type the person is on?'
    )
}
