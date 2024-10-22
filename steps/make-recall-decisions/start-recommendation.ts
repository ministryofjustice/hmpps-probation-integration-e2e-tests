import { expect, type Page } from '@playwright/test'

export const searchForPersonToRecommend = async (page: Page, crn: string, name: string) => {
    await page.getByRole('button', { name: 'Start now' }).click()
    await searchForPerson(page, crn, name)
}

export const recommendAPersonForRecall = async (page: Page): Promise<string> => {
    await page.getByRole('link', { name: 'Make a recommendation' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Consider a recall')

    // What has made you think about recalling the Person
    await page.getByRole('link', { name: /What has made you consider recalling [\w'-]+\s[\w'-]+\?/ }).click()
    await page.locator('#triggerLeadingToRecall').fill('Test reason - Binge Drinking is the reason for recalling')
    await page.getByRole('button', { name: 'Continue' }).click()

    // How has Person responded to probation so far?
    await page.getByRole('link', { name: /How has [\w'-]+\s[\w'-]+ responded to probation so far\?/ }).click()
    await expect(page.locator('#main-content h1')).toContainText(
        /How has [\w'-]+\s[\w'-]+ responded to probation so far\?/
    )
    await page.locator('#responseToProbation').fill('Test Response - Not responded quite well')
    await page.getByRole('button', { name: 'Continue' }).click()

    // What licence conditions has Person breached?
    await page.getByRole('link', { name: /What licence conditions has [\w'-]+\s[\w'-]+ breached\?/ }).click()
    await expect(page.locator('#main-content h1')).toContainText(
        /What licence conditions has [\w'-]+\s[\w'-]+ breached\?/
    )
    await page.locator('#licenceConditionsBreached').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // What alternatives to recall have been tried already?
    await page.getByRole('link', { name: 'What alternatives to recall have been tried already?' }).click()
    await expect(page.locator('#main-content h1')).toContainText('What alternatives to recall have been tried already?')
    await page.locator('#alternativesToRecallTried').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Is Person on an indeterminate sentence?
    await page.getByRole('link', { name: /Is [\w'-]+\s[\w'-]+ on an indeterminate sentence\?/ }).click()
    await expect(page.locator('#main-content h1')).toContainText(/Is [\w'-]+\s[\w'-]+ on an indeterminate sentence\?/)
    await page.locator('#isIndeterminateSentence-2').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Is Person on an extended sentence?
    await expect(page.locator('#main-content h1')).toContainText(/Is [\w'-]+\s[\w'-]+ on an extended sentence\?/)
    await page.locator('#isExtendedSentence-2').check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Record the consideration in NDelius
    await expect(page.locator('h1[class="govuk-fieldset__heading"]')).toContainText(
        'Record the consideration in NDelius'
    )
    await page.locator('#sensitive').check()
    await page.getByRole('button', { name: /Send to NDelius/ }).click()

    // Share this case link with the manager
    await expect(page.locator('#main-content h1')).toContainText('Share this case with your manager')
    const caseLinkToShareWithManager = await page.locator('pre[data-qa="case-link"]').textContent()
    return caseLinkToShareWithManager
}

export const makeManagementOversightDecision = async (page: Page, caseLinkSharedByPO: string) => {
    await page.goto(caseLinkSharedByPO)

    // Review practitioner's concerns
    await expect(page.locator('#main-content h1')).toContainText(/Consider a recall/)
    await page.getByRole('link', { name: "Review practitioner's concerns" }).click()
    await expect(page.locator('#main-content h1')).toContainText("Review practitioner's concerns")
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Review profile of Person
    await page.getByRole('link', { name: /Review profile of [\w'-]+\s[\w'-]+/ }).click()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Explain the decision
    await page.getByRole('link', { name: 'Explain the decision' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Explain the decision')
    await page.locator('#spoRecallType').check()
    await page.locator('#spoRecallRationale').fill('Recall from spo user')
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Record the decision
    await page.locator('.govuk-button', { hasText: 'Record the decision' }).click()
    await expect(page.locator('#main-content legend')).toContainText(/Record the decision in NDelius/)
    await expect(page.locator('#sensitive-hint > p')).toContainText(
        /The decision will be recorded as a contact in NDelius called 'Management oversight - recall'/
    )

    // Send to NDelius
    await page.locator('#sensitive').check()
    await page.locator('.govuk-button', { hasText: /Send to NDelius/ }).click()
    await expect(page.locator('.govuk-panel__title')).toContainText(/Decision to recall/)
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
    await page.locator('[href$="personal-details"]').first().isVisible()
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
    await expect(page).toHaveTitle(/Search for a person on probation.*/)
    await page.click('[href*="/search-by-crn"]')
    await page.fill('#crn', crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator(`a`, { hasText: name }).click()
}
