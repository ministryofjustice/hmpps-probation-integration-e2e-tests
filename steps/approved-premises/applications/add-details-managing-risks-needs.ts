import { type Page, expect } from '@playwright/test'

export const addRisksNeedsDetails = async (page: Page) => {
    await page.locator('#manageRiskDetails').fill("Test reason for AP placement requirement to manage the risk")
    await page.locator('#additionalFeaturesDetails').fill("Test additional measures that will be required for the management of risk")
    // await page.locator('button', { hasText: 'Save and continue' }).click();
    await page.locator('.govuk-button').click();
    //"Has Offender ever been convicted of the following offences" Page
    await expect(page.locator('#main-content h1')).toHaveText(/Has \w+ \w+ ever been convicted of the following offences?/)
    await page.getByLabel('No').check()
    // await page.locator('button', { hasText: 'Save and continue' }).click();
    await page.locator('.govuk-button').click();
    //"Which of the rehabilitative activities will assist the person's rehabilitation in the Approved Premises (AP)?" Page
    await expect(page.locator('#main-content h1')).toHaveText("Which of the rehabilitative activities will assist the person's rehabilitation in the Approved Premises (AP)?")
    await page.getByLabel('Abuse').check()
    // await page.locator('button', { hasText: 'Save and continue' }).click();
    await page.locator('.govuk-button').click();
    await expect(page.locator('#risk-management-features-status')).toHaveText("Completed")
}
