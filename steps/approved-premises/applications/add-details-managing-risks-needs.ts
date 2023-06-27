import { type Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const addRisksNeedsDetails = async (page: Page) => {
    await page.locator('#manageRiskDetails').fill('Test reason for AP placement requirement to manage the risk')
    await page
        .locator('#additionalFeaturesDetails')
        .fill('Test additional measures that will be required for the management of risk')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Has Offender ever been convicted of the following offences" Page
    await expect(page.locator('#main-content h1')).toHaveText(
        /Has [A-Z][a-z'’-]+([ -][A-Z][A-z'’-]+)* ever been convicted of the following offences?/
    )
    await page.getByLabel('No').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Which of the rehabilitative activities will assist the person's rehabilitation in the Approved Premises (AP)?" Page
    await expect(page.locator('#main-content h1')).toHaveText(
        "Which of the rehabilitative activities will assist the person's rehabilitation in the Approved Premises (AP)?"
    )
    await page.getByLabel('Abuse').check()
    await page
        .getByLabel('Provide a summary of how these interventions will assist the persons rehabilitation')
        .fill(faker.lorem.paragraph())
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#risk-management-features-status')).toHaveText('Completed')
}
