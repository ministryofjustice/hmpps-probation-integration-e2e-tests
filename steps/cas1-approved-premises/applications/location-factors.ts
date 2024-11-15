import { type Page, expect } from '@playwright/test'
import { selectOption } from '../../delius/utils/inputs'

export const addLocationFactors = async (page: Page) => {
    await page.locator('#postcodeArea').fill('SW11')
    await page.locator('#positiveFactors').fill('Entering text related to the details of the postcode area')
    await page.locator('#alternativeRadiusAccepted-2').check()
    await page.locator('#restrictions-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    const title = await page.title()

    if (title.includes('Select all preferred properties for your women’s AP application')) {
        // If the title is for the female case
        await expect(page).toHaveTitle(
            /Approved Premises - Select all preferred properties for your women’s AP application/
        )
        await selectOption(page, '#preferredAp1', 'NE Women Premise 1')
    } else if (title === 'Approved Premises - Select a preferred AP') {
        // If the title is for the male case
        await expect(page).toHaveTitle(/Approved Premises - Select a preferred AP/)
        await selectOption(page, '#area0', 'Wales')
        await selectOption(page, '#preferredAp1', 'LON Men Premise 1')
    } else {
        throw new Error(`Unexpected page title: ${title}`)
    }

    await page.click('button.govuk-button')
}
