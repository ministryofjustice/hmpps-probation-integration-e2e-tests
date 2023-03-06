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
    await expect(page.locator('.govuk-heading-xl')).toContainText('Risk of harm in the community')
}

export const clickManagingRiskLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Managing risk' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Managing risk')
}

export const clickDisabilitiesAndMentalHealthLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Disabilities and mental health' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Disabilities and mental health')
}

export const clickHealthIssuesLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Health issues' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText(
        'Are there any other health issues that may affect ability to work?'
    )
}

export const clickGPDetailsLink = async (page: Page) => {
    await page.getByRole('link', { name: 'GP Details' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('GP Details')
}

export const clickTravelInformationLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Travel' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Travel information')
}

export const clickCaringCommitmentsLink = async (page: Page) => {
    await page.getByRole('link', { name: 'Caring commitments' }).click()
    await expect(page.locator('#main-content caption')).toContainText('Are there carer commitments? ')
}
