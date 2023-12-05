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
    const popup = await page.waitForEvent('popup')
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Home/)
    await popup.locator('text=Start now').click()
    // - Offender details
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offender details/)
    await expect(await popup.locator('#name').inputValue()).toContain(person.firstName)
    await expect(await popup.locator('#name').inputValue()).toContain(person.lastName)
    await expect(popup.locator('#crn')).toHaveValue(crn)
    await popup.locator('textarea[name="address"]').fill(faker.location.streetAddress(true))

    await popup.locator('text=Save and continue').click()
    // - Sentencing court details
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Sentencing court details/)
    await expect(popup.locator('#court')).toHaveValue(event.court)
    await popup.locator('input[name="localJusticeArea"]').fill(faker.location.city())
    const dateOfHearing = faker.date.recent()
    await popup.locator('input[name="dateOfHearing-day"]').fill(dateOfHearing.getDate().toString())
    await popup.locator('input[name="dateOfHearing-month"]').fill((dateOfHearing.getMonth() + 1).toString())
    await popup.locator('input[name="dateOfHearing-year"]').fill(dateOfHearing.getFullYear().toString())
    await popup.locator('text=Save and continue').click()
    // - Offence details
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offence details/)
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.locator('text=Save and continue').click()
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offence analysis/)

    await popup.locator('#offenceAnalysis ~ .ck [contenteditable="true"]').click()
    await popup.keyboard.type(faker.lorem.sentence())
    await popup.locator('#patternOfOffendingBehaviour ~ .ck [contenteditable="true"]').click()
    await popup.keyboard.type(faker.lorem.sentence())
    await popup.locator('text=Save and continue').click()

    // - Offender assessment
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offender assessment/)
    await popup.locator('input[name=assessmentFactors][value=issueAccommodation]').click()
    await popup.locator('input[name=experienceOfTrauma][value=no]').click()
    await popup.locator('input[name=caringResponsibilities][value=no]').click()
    await popup.locator('text=Save and continue').click()
    // - Risk assessment
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Risk assessment/)
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.locator('input[type=radio][value="N/A"]').click()
    await popup.locator('text=Save and continue').click()
    // - Proposal
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Proposal/)
    await popup.locator('input[type=radio][value=yes]').click()
    for (const textarea of await popup.locator('[contenteditable]').elementHandles()) {
        await textarea.click()
        await popup.keyboard.type(faker.lorem.sentence())
    }
    await popup.locator('text=Save and continue').click()
    // - Sources of information
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Sources of information/)
    await popup.locator('input[type=checkbox][value=interviewInformationSource]').click()
    await popup.locator('text=Save and continue').click()
    // - Check and sign your report
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Check your report/)
    await popup.locator('text=Sign your report').click()
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Sign your report/)
    await popup.locator('input[name="office"]').fill(faker.location.streetAddress())
    await popup.locator('input[name="officePhoneNumber"]').fill(faker.phone.number())
    await popup.locator('input[name="counterSignature"]').fill(faker.person.fullName())
    await popup.locator('text=Submit and view your report').click()
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Report completed/)
    await popup.close()

    // Then the document appears in the Delius document list
    await expect(page.locator('#documentListForm\\:documentTable a.last')).toContainText('open in pre-sentence service')

    // And the PDF appears in non-DRAFT form in the subject access report zip file
    await createSubjectAccessReport(page, crn, `downloads/${crn}-sar.zip`)
    const file = await getFileFromZip(`downloads/${crn}-sar.zip`, /.+\.pdf/)
    const pdfText = await getPdfText(file)
    await expect(pdfText).not.toContain('DRAFT')
})
