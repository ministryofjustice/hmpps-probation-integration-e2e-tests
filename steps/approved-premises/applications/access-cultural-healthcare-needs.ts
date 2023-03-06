import { type Page, expect } from '@playwright/test'

export const addAccessCulturalHealthCareNeeds = async (page: Page) => {
    await page.locator('#additionalNeeds').check()
    await page.locator('#religiousOrCulturalNeeds-2').check()
    await page.locator('#needsInterpreter-2').check()
    await page.locator('#careActAssessmentCompleted-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Specify any additional details and the adjustments required" Page
    await expect(page.locator('#main-content form > p')).toHaveText(
        'Specify any additional details and the adjustments required'
    )
    await page.locator('#needsWheelchair-2').check()
    await page.locator('#mobilityNeeds').fill('step-free access for reduced mobility is required')
    await page.locator('#visualImpairment').fill('braille or tactile flooring is required')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "COVID information" Page
    await expect(page.locator('#main-content h1')).toHaveText('COVID information')
    await page.locator('#fullyVaccinated-2').check()
    await page.locator('#highRisk-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#access-and-healthcare-status')).toHaveText('Completed')
}
