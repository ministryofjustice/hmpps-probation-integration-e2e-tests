import { expect, type Page } from '@playwright/test'

export const clickIndividualDetailsLink = async (page: Page) => {
    await page.getByRole('link', { name: "Individual's details" }).click()
    await expect(page.locator('#main-content h1')).toHaveText("Individual's details")
}

export const clickGenderInformationLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Gender information' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Gender information')
}

export const clickCulturalReligiousAdjustmentsLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Cultural and religious adjustments' }).click()
    await expect(page.locator("[class$='adjustment govuk-label--m']")).toContainText(
        'Are adjustments required for cultural or religious reasons?'
    )
}
