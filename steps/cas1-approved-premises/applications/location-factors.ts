import { type Page, expect } from '@playwright/test'
import { selectOption } from '../../delius/utils/inputs'

export const addLocationFactors = async (page: Page) => {
    await page.locator('#postcodeArea').fill('SW11')
    await page.locator('#positiveFactors').fill('Entering text related to the details of the postcode area')
    await page.locator('#alternativeRadiusAccepted-2').check()
    await page.locator('#restrictions-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page).toHaveTitle('Approved Premises - Select a preferred AP')
    await selectOption(page, '#preferredAp1', 'Test AP 1')
    await page.click('button.govuk-button')
}
