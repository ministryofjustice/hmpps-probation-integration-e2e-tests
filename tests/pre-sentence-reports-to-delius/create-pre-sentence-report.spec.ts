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
import { createSubjectAccessReport, getFileFromZip } from '../../steps/delius/document/subject-access-report'
import { getPdfText } from '../../steps/delius/utils/pdf-utils'

test('Create a short format pre-sentence report', async ({ page }) => {
    // Given a person with an event that has been adjourned for pre-sentence report,
    // and a court report with a newly created pre-sentence report document
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const event = await createEvent(page, {
        crn,
        event: data.events.adjournedForFastPreSentenceReport,
        allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff },
    })
    await page.locator('input', { hasText: 'Save' }).click()
    await findCourtReport(page, crn)
    await createDocumentFromTemplate(page, data.documentTemplates.shortFormatPreSentenceReport)

    // When I complete the pre-sentence report in the popup window
    const iframe = page.locator('iframe[title="pdfcreation-frame"]').contentFrame()
    await expect(iframe.getByRole('heading')).toContainText(/Short Format Pre-sentence Report/)
    const popupPromise = page.waitForEvent('popup')
    await iframe.getByRole('button', { name: 'Start now' }).click()
    const popup = await popupPromise

    // - Offender details
    await expect(popup).toHaveTitle(/Offender details/)
    await expect(await popup.locator('#value_name')).toContainText(person.firstName)
    await expect(await popup.locator('#value_name')).toContainText(person.lastName)
    await expect(popup.locator('#value_crn')).toContainText(crn)
    await popup.locator('input[name="address"]').fill(faker.location.streetAddress(true))
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Sentencing court details
    await expect(popup).toHaveTitle(/Sentencing court details/)
    await expect(popup.locator('#court')).toHaveValue(event.nextCourt)
    await popup.locator('input[name="localJusticeArea"]').fill(faker.location.city())
    const dateOfHearing = faker.date.recent()
    await popup.locator('input[name="dateOfHearing_day"]').fill(dateOfHearing.getDate().toString())
    await popup.locator('input[name="dateOfHearing_month"]').fill((dateOfHearing.getMonth() + 1).toString())
    await popup.locator('input[name="dateOfHearing_year"]').fill(dateOfHearing.getFullYear().toString())
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Offence details
    await expect(popup).toHaveTitle(/Offence details/)
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Offence analysis
    await expect(popup).toHaveTitle(/Offence analysis/)
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Offender assessment
    await expect(popup).toHaveTitle(/Offender assessment/)
    await popup.locator('input[name=issueAccommodation]').click()
    await popup.locator('input[name=experienceTrauma][value=no]').click()
    await popup.locator('input[name=caringResponsibilities][value=no]').click()
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Risk assessment
    await expect(popup).toHaveTitle(/Risk assessment/)
    await popup.locator('input[type=radio][value="N/A"]').click()
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Proposal
    await expect(popup).toHaveTitle(/Proposal/)
    await popup.locator('input[type=radio][value=yes]').click()
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Sources of information
    await expect(popup).toHaveTitle(/Sources of information/)
    await popup.locator('input[type=checkbox][name=interviewInformationSource]').click()
    await popup.getByRole('button', { name: 'Continue' }).click()

    // - Check and sign your report
    await expect(popup).toHaveTitle(/Check your report/)
    await popup.getByRole('button', { name: 'Sign' }).click()

    await expect(popup).toHaveTitle(/Sign your report/)
    await popup.locator('input[name="reportAuthor"]').fill(faker.person.fullName())
    await popup.locator('input[name="office"]').fill(faker.location.streetAddress())
    await popup.locator('input[name="courtOfficePhoneNumber"]').fill(faker.phone.number())
    await popup.locator('input[name="counterSignature"]').fill(faker.person.fullName())
    await popup.getByRole('button', { name: 'Submit' }).click()
    await expect(popup).toHaveTitle(/Report saved/)
    await popup.close()

    // Then the document appears in the Delius document list
    await iframe.getByRole('link', { name: 'Back to document list' }).click()
    await page.locator('#documentTable [id="viewButton"]').click()

    // And the PDF appears in non-DRAFT form in the subject access report zip file
    await createSubjectAccessReport(page, crn, `downloads/${crn}-sar.zip`)
    const file = await getFileFromZip(`downloads/${crn}-sar.zip`, /.+\.pdf/)
    const pdfText = await getPdfText(file)
    expect(pdfText).not.toContain('DRAFT') // need to confirm this as report contains 'DRAFTOFFICIAL' text
})
