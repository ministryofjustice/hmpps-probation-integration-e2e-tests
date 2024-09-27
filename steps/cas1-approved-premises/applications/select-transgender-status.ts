import { type Page, expect } from '@playwright/test'
import { DateTime } from 'luxon'

export const selectTransgenderStatus = async (page: Page) => {
    await page.locator('#transgenderOrHasTransgenderHistory-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Which of the following dates are relevant?')
}

export const enterSedLedPssDates = async (page: Page) => {
    // Add 9 months to the current date
    const futureDate = DateTime.now().plus({ months: 9 });

    // Format day, month, and year using Luxon
    const day = futureDate.toFormat('dd')
    const month = futureDate.toFormat('MM')
    const year = futureDate.toFormat('yyyy')

    // Fill in the Sentence expiry date
    await page.getByLabel('Sentence expiry date').check()
    await page.locator('#sentenceExpiryDate-day').fill(day)
    await page.locator('#sentenceExpiryDate-month').fill(month)
    await page.locator('#sentenceExpiryDate-year').fill(year)

    // Fill in the Licence expiry date
    await page.getByLabel('Licence expiry date').check()
    await page.locator('#licenceExpiryDate-day').fill(day)
    await page.locator('#licenceExpiryDate-month').fill(month)
    await page.locator('#licenceExpiryDate-year').fill(year)

    // Fill in the Post sentence supervision (PSS) end date
    await page.getByLabel('Post sentence supervision (PSS) end date').check()
    await page.locator('#pssEndDate-day').fill(day)
    await page.locator('#pssEndDate-month').fill(month)
    await page.locator('#pssEndDate-year').fill(year)

    // Click the save button
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // Expect the next page to load correctly
    await expect(page.locator('.govuk-fieldset__heading')).toHaveText(
        'Which of the following best describes the sentence type the person is on?'
    );
}
