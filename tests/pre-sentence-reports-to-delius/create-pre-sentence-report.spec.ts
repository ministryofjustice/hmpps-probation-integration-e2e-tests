import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import { data } from '../../test-data/test-data'
import { faker } from '@faker-js/faker'
import { findCourtReport } from '../../steps/delius/court-report/find-court-report'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document'
import { getPdfText } from '../../steps/delius/utils/pdf-utils'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { selectOption } from '../../steps/delius/utils/inputs'
import fs from 'fs'
import { refreshUntil } from '../../steps/delius/utils/refresh'

test('Create a pre-sentence report', async ({ page }) => {
    // Given a person with an event that has been adjourned for a pre-sentence report,
    // and a court report with a newly created pre-sentence report document
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const address = buildAddress()
    await createAddress(page, crn, address)
    const event = await createEvent(page, {
        crn,
        event: data.events.adjournedForFastPreSentenceReport,
        allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff },
    })
    await page.locator('input', { hasText: 'Save' }).click()
    await findCourtReport(page, crn)
    await createDocumentFromTemplate(page, data.documentTemplates.adjournedPsr)

    // When I complete the pre-sentence report in the popup window
    // Start waiting for popup before clicking. Note no await.
    const popupPromise = page.waitForEvent('popup')
    await page.locator('#documentTable\\:0\\:openExternalButton').click()
    const popup = await popupPromise
    const pageTitle = popup.locator('h1.govuk-heading-xl')
    await popup.locator('//h1[contains(text(), "Write a pre-sentence report (PSR)")]').isVisible()
    await popup.locator('text=Start now').click()

    // - Defendant details
    await expect(pageTitle).toContainText(/Defendant details/)
    expect(await popup.locator('//th[text()="Full name"]/../td').textContent()).toContain(person.firstName)
    expect(await popup.locator('//th[text()="Full name"]/../td').textContent()).toContain(person.lastName)
    expect(await popup.locator('//th[text()="Date of birth"]/../td').textContent()).toContain(
        person.dob.toLocaleDateString('en-GB')
    )
    const addressLocator = popup.locator('//th[text()="Current address"]/../td')
    await expect(addressLocator).toContainText(address.buildingNumber)
    await expect(addressLocator).toContainText(address.street)
    await expect(addressLocator).toContainText(address.cityName)
    await expect(addressLocator).toContainText(address.zipCode)
    await popup.locator('text=Save and continue').click()

    // - Offence analysis
    await expect(pageTitle).toContainText(/Offence analysis/)
    await expect(popup.locator('//tbody/tr[@class="govuk-table__row"]/td[1]')).toContainText(
        data.events.adjournedForFastPreSentenceReport.mainOffence.split(' -')[0]
    )
    await popup.locator('#offencesUnderConsideration').click()
    await popup.keyboard.type(faker.lorem.sentence())
    await popup.locator('#offencesPattern').fill(faker.lorem.sentence())
    await popup.locator('text=Save and continue').click()

    // - Defendant behaviour and lifestyle assessment
    await popup.getByRole('heading', { name: 'Defendant behaviour and lifestyle assessment' }).isVisible()
    await popup.locator('#defendantBehaviour').fill(faker.lorem.sentence())
    await popup.locator('text=Save and continue').click()

    // - Risk analysis
    await expect(pageTitle).toContainText(/Risk analysis/)
    await selectOption(popup, '#risk-to-children', 'Medium risk')
    await selectOption(popup, '#risk-to-public', 'Low risk')
    await selectOption(popup, '#risk-to-known-adults', 'High risk')
    await selectOption(popup, '#risk-to-staff', 'Low risk')
    await popup.locator('#risk-predictors').fill(faker.lorem.sentence())
    await popup.locator('#risk-riskAndHarmFactors').fill(faker.lorem.sentence())
    await popup.locator('text=Save and continue').click()

    // - Sentencing proposal
    await popup.getByRole('heading', { name: 'Sentencing proposal' }).isVisible()
    await popup.locator('#proposedSentence').fill(faker.lorem.sentence())
    await popup.locator('#proposedSentenceRationale').fill(faker.lorem.sentence())
    await popup.locator('#alternativeSentencingOptions').fill(faker.lorem.sentence())
    await popup.locator('#custodial-sentence-not-threshold').click()
    await popup.locator('text=Save and continue').click()

    // - Sources of information
    await popup.getByRole('heading', { name: 'Sources of information' }).isVisible()
    await popup.locator('#sentencing_guidelines').check()
    await popup.locator('text=Save and continue').click()

    // - Review progress and sign your report
    await expect(pageTitle).toContainText(/Review your progress/)
    await popup.locator('ol').getByRole('link', { name: 'Sign and lock your report' }).click()
    await expect(pageTitle).toContainText(/Sign and lock your report/)
    await popup.locator('#signReportName').fill(faker.person.fullName())
    await popup.locator('input[type=radio][value="no"]').click()
    await popup.getByRole('button', { name: 'Submit' }).click()
    await popup.getByRole('button', { name: 'Sign and lock' }).click()
    await expect(popup).toHaveTitle(/Pre-sentence report completed/)
    await popup.close()

    // Then the document is updated in Delius
    await refreshUntil(page, () => expect(page.getByRole('link', { name: 'view', exact: true })).toBeVisible())
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', { name: 'view', exact: true }).click(),
    ])
    const filePath = `downloads/${crn}-pre-sentence-report.pdf`
    await download.saveAs(filePath)

    // And the PDF appears in non-DRAFT form in the report file
    const pdf = await getPdfText(fs.readFileSync(filePath))
    expect(pdf).not.toContain('DRAFT')
})
