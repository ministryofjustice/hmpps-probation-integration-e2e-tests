import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { login as cvlLogin, loginAsPrisonOfficer } from './login'

export const createLicence = async (page: Page, crn: string, nomsNumber: string) => {
    await cvlLogin(page)
    await page.getByRole('link', { name: 'Create and edit a licence before a release date' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - Caseload')
    await page.getByLabel('Find a case').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator(`[href*="${nomsNumber}"]`).click()
    await expect(page).toHaveTitle(/Create and vary a licence - Create a licence - Are you sure?/)
    await page.getByRole('button', { name: /Continue and create licence/ }).click()
    await expect(page).toHaveTitle(
        'Create and vary a licence - Create a licence - Who is the initial appointment with?'
    )
    await page.getByLabel(/Who is the initial appointment with?/).fill(faker.person.fullName())
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - Where is the initial appointment?')
    await page.getByRole('link', { name: /Enter address manually/ }).click()
    await page
        .getByLabel(/Address line 1/)
        .first()
        .fill(faker.location.buildingNumber() + ' ' + faker.location.street())
    await page.getByLabel(/Town or city/).fill(faker.location.city())
    await page.getByLabel('County (optional)').fill(faker.location.county())
    await page.getByLabel(/Postcode/).fill(faker.location.zipCode())
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle(
        'Create and vary a licence - Create a licence - What is the contact phone number for the initial appointment?'
    )
    await page.getByLabel('UK telephone number').fill(cvlFormattedPhoneNumber())
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - When is the initial appointment?')
    await page.getByLabel(/Immediately after release/).check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - Additional Licence Conditions')
    await page.getByLabel(/No/).check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - Bespoke Conditions')
    await page.getByLabel(/No/).check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - Check your answers')
    await page.getByRole('button', { name: /Send to prison for approval/ }).click()
    await expect(page).toHaveTitle('Create and vary a licence - Create a licence - Confirmation')
    await page.getByRole('link', { name: /Sign out/ }).click()
}

export const approveLicence = async (page: Page, crn: string, nomsNumber: string, establishment: string) => {
    await loginAsPrisonOfficer(page)
    await page.getByRole('link', { name: 'Approve a licence' }).click()
    await expect(page).toHaveTitle('Create and vary a licence - approval cases')
    await page.getByLabel('Find a case').fill(crn)
    await page.getByRole('button', { name: 'Search', exact: true }).first().click()
    await page.getByRole('link', { name: 'Licences for other' }).click()
    await page.getByLabel(establishment).check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.locator(`tr:has([data-sort-value="${nomsNumber}"]) td#name-1 a.govuk-link`).click()
    await expect(page).toHaveTitle('Create and vary a licence - Approve a licence')
    await page.getByRole('button', { name: /Approve/ }).click()
    await expect(page).toHaveTitle('Create and vary a licence - licence approved')
    await page.locator('[data-qa$="user-name"]').click()
    await page.getByRole('link', { name: /Sign out/ }).click()
}

const cvlFormattedPhoneNumber = (): string => {
    const areaCode =
        '01' +
        Math.floor(Math.random() * 1000)
            .toString()
            .padStart(2, '0') // Generate a random 3-digit number as the last 3 digits of the area code
    const cityNumber = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0') // Generate a random 6-digit city number
    return `${areaCode} ${cityNumber}`
}
