import { expect, type Page } from '@playwright/test'
import { recallDateFormatter } from '../delius/utils/date-time.js'

export const searchForPersonToRecommend = async (page: Page, crn: string, name: string) => {
    await page.getByRole('button', { name: 'Start now' }).click()
    await searchForPerson(page, crn, name)
}

export const startRecommendation = async (page: Page) => {
    await page.getByRole('link', { name: 'Make a recommendation' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
}

export const verifyRecallOffenderDetails = async (
    page: Page,
    crnInDelius: string,
    dobInDelius: Date,
    genderInDelius: string
): Promise<void> => {
    const crnInRecall = page.locator('[data-qa="personalDetailsOverview-crn"]')
    const dobInRecall = page.locator('[data-qa="personalDetailsOverview-dateOfBirth"]')
    const genderInRecall = page.locator('[data-qa="personalDetailsOverview-gender"]')
    await expect(crnInRecall).toContainText(crnInDelius)
    await expect(dobInRecall).toContainText(
        dobInDelius.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    )
    await expect(genderInRecall).toContainText(genderInDelius)
}

export const verifyRecallOffendersAddress = async (
    page: Page,
    street: string,
    city: string,
    postcode: string
): Promise<void> => {
    await page.getByRole('link', { name: 'Personal details' }).click()
    const addressLocator = await page.locator('[data-qa="address-1"]').first()
    await expect(addressLocator).toContainText(street)
    await expect(addressLocator).toContainText(city)
    if (postcode.length > 8) {
        postcode = postcode.substring(0, 8)
    }
    await expect(addressLocator).toContainText(postcode)
}

export const verifyLicenceCondition = async (page: Page, licenceCondition: string): Promise<void> => {
    await page.getByRole('link', { name: 'Licence conditions' }).click()
    const recallLicenseDesc = await page
        .locator('#accordion-with-summary-sections-content-2 p, [data-qa="condition-description"]')
        .first()
        .textContent()
    await expect(recallLicenseDesc).toMatch(licenceCondition.replace(/(.*)-/, '').trim())
}

export const verifyContact = async (page: Page, contactDetails: string): Promise<void> => {
    await page.getByRole('link', { name: 'Contact history' }).click()
    await expect(page.locator('[data-qa="contact-1"]')).toContainText(contactDetails)
}

async function searchForPerson(page: Page, crn: string, name: string) {
    await expect(page.locator('h1')).toHaveText('Search for a person on probation')
    await page.fill('#crn', crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator(`a`, { hasText: name }).click()
}
