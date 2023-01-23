import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker/locale/en_GB'

export const createRecommendation = async (page: Page, crn: string, name: string) => {
    await page.getByRole('button', { name: 'Start now' }).click()
    await searchForPerson(page, crn, name)
    await startRecommendation(page)
    await compliance(page, name)
    await breachedLicenceConditions(page)
    await alternatives(page)
    await managerReview(page)
    await sentenceType(page)
    await recallType(page)
    await emergencyRecall(page)
    await sensitiveInformation(page)
    await custody(page)
    await whatHasLedToThisRecall(page)
    await personalDetails(page)
    await offenceDetails(page)
    await offenceAnalysis(page)
    await previousReleases(page)
    await address(page)
    await vulnerability(page)
    await victim(page)
    await policeDetails(page)
    await integratedOffenderManagement(page, name)
    await otherInfoForPolice(page, name)
    await contraband(page, name)
    await mappa(page, name)
    await page.getByRole('link', { name: 'Create Part A' }).click()
    await expect(page.locator('h1')).toContainText('Part A created')
}

async function searchForPerson(page: Page, crn: string, name: string) {
    await expect(page.locator('h1')).toHaveText('Search for a person on probation')
    await page.fill('#crn', crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator(`a`, { hasText: name }).click()
}

async function startRecommendation(page: Page) {
    await page.getByRole('button', { name: 'Make a recommendation' }).click()
}

async function compliance(page: Page, name: string) {
    await page.getByLabel(`How has ${name} responded to probation so far?`).fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function breachedLicenceConditions(page: Page) {
    await page.locator('#additional-1').click()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function alternatives(page: Page) {
    await page.getByLabel('None').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function managerReview(page: Page) {
    await page.getByRole('link', { name: 'Continue' }).click()
}

async function sentenceType(page: Page) {
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function recallType(page: Page) {
    await page.getByLabel('Standard recall').check()
    await page.getByRole('textbox', { name: 'Why do you recommend this recall type?' }).fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function emergencyRecall(page: Page) {
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function sensitiveInformation(page: Page) {
    await page.getByRole('link', { name: 'Continue' }).click()
}

async function custody(page: Page) {
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function whatHasLedToThisRecall(page: Page) {
    await page.getByRole('link', { name: 'What has led to this recall?' }).click()
    await page.getByLabel('What has led to this recall?').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function personalDetails(page: Page) {
    await page.getByRole('link', { name: 'Personal details' }).click()
    await page.getByRole('link', { name: 'Continue' }).click()
}

async function offenceDetails(page: Page) {
    await page.getByRole('link', { name: 'Offence details' }).click()
    await page.getByRole('link', { name: 'Continue' }).click()
}

async function offenceAnalysis(page: Page) {
    await page.getByRole('link', { name: 'Offence analysis' }).click()
    await page.getByLabel('Write the offence analysis').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function previousReleases(page: Page) {
    await page.getByRole('link', { name: 'Previous releases' }).click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function address(page: Page) {
    await page.getByRole('link', { name: 'Address' }).click()
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function vulnerability(page: Page) {
    await page.getByRole('link', { name: 'Would recall affect vulnerability or additional needs?' }).click()
    await page.getByLabel('None').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function victim(page: Page) {
    await page.getByRole('link', { name: 'Are there any victims in the victim contact scheme?' }).click()
    await page.locator('#hasVictimsInContactScheme-2').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function policeDetails(page: Page) {
    await page.getByRole('link', { name: 'Local police contact details' }).click()
    await page.getByLabel('Police contact name').fill(faker.name.fullName())
    await page.getByLabel('Telephone number').fill(faker.phone.number('07### ### ###'))
    await page.getByLabel('Email address').fill(faker.internet.exampleEmail())
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function integratedOffenderManagement(page: Page, name: string) {
    await page.getByRole('link', { name: `Is ${name} under Integrated Offender Management (IOM)?` }).click()
    await page.locator('#isUnderIntegratedOffenderManagement-2').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function otherInfoForPolice(page: Page, name: string) {
    await page
        .getByRole('link', { name: `Is there anything the police should know before they arrest ${name}?` })
        .click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function contraband(page: Page, name: string) {
    await page
        .getByRole('link', { name: `Do you think ${name} is using recall to bring contraband into prison?` })
        .click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function mappa(page: Page, name: string) {
    await page.getByRole('link', { name: `MAPPA for ${name}` }).click()
    await page.getByRole('link', { name: 'Continue' }).click()
}
