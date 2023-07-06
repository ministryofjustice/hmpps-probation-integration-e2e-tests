import { type Page, expect } from '@playwright/test'
import { addMonths, format } from 'date-fns';

export const selectTransgenderStatus = async (page: Page) => {
    await page.locator('#transgenderOrHasTransgenderHistory-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'Which of the following dates are relevant?'
    )
}

export const enterSedLedPssDates = async (page: Page) => {
    const futureDate = addMonths(new Date(), 9);
    const day = format(futureDate, 'dd');
    const month = format(futureDate, 'MM');
    const year = format(futureDate, 'yyyy');
    await page.locator('#sedDate-day').fill(day);
    await page.locator('#sedDate-month').fill(month);
    await page.locator('#sedDate-year').fill(year);
    await page.locator('#ledDate-day').fill(day);
    await page.locator('#ledDate-month').fill(month);
    await page.locator('#ledDate-year').fill(year);
    await page.locator('#pssDate-day').fill(day);
    await page.locator('#pssDate-month').fill(month);
    await page.locator('#pssDate-year').fill(year);
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('.govuk-fieldset__heading')).toHaveText(
        'Which of the following best describes the sentence type the person is on?'
    )
}
