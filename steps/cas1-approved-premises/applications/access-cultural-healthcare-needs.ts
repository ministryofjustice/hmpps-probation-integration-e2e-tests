import { type Page, expect } from '@playwright/test'

export const addAccessCulturalHealthCareNeeds = async (page: Page) => {
    await page.locator('#additionalNeeds').check()
    await page.locator('#religiousOrCulturalNeeds-2').check()
    await page.locator('#careAndSupportNeeds-2').check()
    await page.locator('#needsInterpreter-2').check()
    await page.locator('#careActAssessmentCompleted-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Specify any additional details and the adjustments required" Page
    await expect(page.locator('#main-content form > p')).toHaveText(
        'Specify any additional details and the adjustments required'
    )
    await page.locator('#needsWheelchair-2').check()
    await page.locator('#healthConditions-2').check()
    await page.locator('#prescribedMedication-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "COVID information" Page
    await expect(page.locator('#main-content h1')).toHaveText('Access, cultural and healthcare needs')
    await page.locator('#additionalAdjustments').fill('step-free access for reduced mobility is required')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('COVID information')
    await page.locator('#boosterEligibility-2').check()
    await page.locator('#immunosuppressed-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#access-and-healthcare-status')).toHaveText('Completed')
}
