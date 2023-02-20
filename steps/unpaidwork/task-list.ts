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

export const clickPlacementPreferencesLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Placement preferences' }).click()
    await expect(page.locator("[class$='placement_preference govuk-label--m']")).toContainText(
        'Does the individual have any placement preferences?'
    )
}

export const clickRiskOfHarmCommunityLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Risk of harm in the community' }).click()
    await expect(page.locator(".govuk-heading-xl")).toContainText(
        'Risk of harm in the community'
    )
}

export const clickManagingRiskLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Managing risk' }).click()
    await expect(page.locator(".govuk-heading-xl")).toContainText(
        'Managing risk'
    )
}
