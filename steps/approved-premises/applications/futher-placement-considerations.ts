import { type Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const addFurtherPlacementConsiderations = async (page: Page) => {
    await page.locator('#riskToStaff-2').check()
    await page.locator('#riskToOthers-2').check()
    await page.locator('#sharingConcerns-2').check()
    await page.locator('#traumaConcerns-2').check()
    await page.locator('#sharingBenefits-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Vulnerability')

    // "Vulnerability" Page
    await page.locator('#exploitable-2').check()
    await page.locator('#exploitOthers-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Previous Approved Premises (AP) placements" Page
    await expect(page.locator('#main-content h1')).toContainText('Previous Approved Premises (AP) placements')
    await page.locator('#previousPlacement-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Catering requirements" Page
    await expect(page.locator('#main-content h1')).toContainText('Catering requirements')
    await page.locator('#catering').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Arson" Page
    await expect(page.locator('#main-content h1')).toContainText('Arson')
    await page.locator('#arson-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Additional circumstances" Page
    await expect(page.locator('#main-content h1')).toContainText('Additional circumstances')
    await page.locator('#additionalCircumstances-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Contingency plans" Page
    await expect(page.locator('#main-content h1')).toContainText('Contingency plans')
    const agency = page.getByRole('group', { name: 'Partner Agency 1' })
    await agency.getByLabel('Name of partner agency').fill(faker.company.name())
    await agency.getByLabel('Named contact').fill(faker.person.fullName())
    await agency.getByLabel('Contact details').fill('01452364589')
    await agency.getByLabel('Role in contingency plan').fill(faker.company.buzzAdjective())
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await page
        .locator('#noReturn')
        .fill('Test actions should be taken, if the person does not return to the AP for curfew')
    await page
        .locator('#placementWithdrawn')
        .fill("Test actions should be taken, if the person's placement needs to be withdrawn out of hours")
    await page
        .locator('#victimConsiderations')
        .fill('Test victim considerations that the AP need to be aware of when out of hours')
    await page
        .locator('#unsuitableAddresses')
        .fill(
            'Test unsuitable addresses that the person cannot reside at, in the event of an out of hours placement withdrawal'
        )
    await page
        .locator('#suitableAddresses')
        .fill(
            'Test alternative suitable addresses that the person can reside at, in the event of an out of hours placement withdrawal, provide alternative suitable addresses'
        )
    await page
        .locator('#breachInformation')
        .fill('Test information to support Out of Hours (OoH) decision making, in the event of a breach')
    await page.locator('#otherConsiderations').fill('Test other considerations')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#further-considerations-status')).toHaveText('Completed')
}
