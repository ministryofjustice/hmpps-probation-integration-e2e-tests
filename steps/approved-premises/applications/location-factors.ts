import { type Page, expect } from '@playwright/test'

export const addLocationFactors = async (page: Page) => {
    await page.locator('#postcodeArea').fill('SW11')
    await page.locator('#positiveFactors').fill('Entering text related to the details of the postcode area')
    await page.locator('#alternativeRadiusAccepted-2').check()
    await page.locator('#restrictions-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#location-factors-status')).toHaveText('Completed')
}
