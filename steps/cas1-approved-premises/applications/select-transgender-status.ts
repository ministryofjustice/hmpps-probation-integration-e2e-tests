import { type Page, expect } from '@playwright/test'
import { addMonths, format } from 'date-fns'

export const selectTransgenderStatus = async (page: Page) => {
    await page.locator('#transgenderOrHasTransgenderHistory-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Which of the following dates are relevant?')
}

export const enterSedLedPssDates = async (page: Page) => {
    const futureDate = addMonths(new Date(), 9)
    const day = format(futureDate, 'dd')
    const month = format(futureDate, 'MM')
    const year = format(futureDate, 'yyyy')
    await page.getByLabel('Sentence expiry date').check()
    await page.locator('#sentenceExpiryDate-day').fill(day)
    await page.locator('#sentenceExpiryDate-month').fill(month)
    await page.locator('#sentenceExpiryDate-year').fill(year)
    await page.getByLabel('Licence expiry date').check()
    await page.locator('#licenceExpiryDate-day').fill(day)
    await page.locator('#licenceExpiryDate-month').fill(month)
    await page.locator('#licenceExpiryDate-year').fill(year)
    await page.getByLabel('Post sentence supervision (PSS) end date').check()
    await page.locator('#pssEndDate-day').fill(day)
    await page.locator('#pssEndDate-month').fill(month)
    await page.locator('#pssEndDate-year').fill(year)
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('.govuk-fieldset__heading')).toHaveText(
        'Which of the following best describes the sentence type the person is on?'
    )
}
