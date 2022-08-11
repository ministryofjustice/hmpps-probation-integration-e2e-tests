import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import { data } from '../../test-data/test-data'
import { faker } from '@faker-js/faker'
import PDFParser from 'pdf2json'
import { findCourtReport } from '../../steps/delius/court-report/find-court-report'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document'
import { createSubjectAccessReport, getFileFromZip } from '../../steps/delius/document/subject-access-report'

test('Create a short format pre-sentence report', async ({ page }) => {
    // Given a person with an event that has been adjourned for pre-sentence report,
    // and a court report with a newly created pre-sentence report document
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createEvent(page, { crn, event: data.events.adjournedForFastPreSentenceReport })
    await page.locator('input', { hasText: 'Save' }).click()
    await findCourtReport(page, crn)
    await createDocumentFromTemplate(page, data.documentTemplates.shortFormatPreSentenceReport)

    // When I complete the pre-sentence report in the popup window
    const popup = await page.waitForEvent('popup')
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Home/)
    await popup.locator('text=Start now').click()
    // - Offender details
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offender details/)
    await popup.locator('textarea[name="address"]').fill(faker.address.streetAddress(true))
    await popup.locator('input[name="pnc"]').fill(faker.random.alphaNumeric(10, { casing: 'upper' }))
    await popup.locator('text=Save and continue').click() // FIXME this currently fails due to an error in pre-sentence-service
    // - Sentencing court details
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Sentencing court details/)
    const dateOfHearing = faker.date.recent()
    await popup.locator('input[name="dateOfHearing-day"]').fill(dateOfHearing.getDate().toString())
    await popup.locator('input[name="dateOfHearing-month"]').fill((dateOfHearing.getMonth() + 1).toString())
    await popup.locator('input[name="dateOfHearing-year"]').fill(dateOfHearing.getFullYear().toString())
    await popup.locator('text=Save and continue').click()
    // - Offence details
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offence details/)
    for (const textarea of await popup.locator('textarea').elementHandles()) {
        await textarea.fill(faker.lorem.paragraphs())
    }
    await popup.locator('text=Save and continue').click()
    // - Offence analysis
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offence analysis/)
    for (const textarea of await popup.locator('textarea').elementHandles()) {
        await textarea.fill(faker.lorem.paragraphs())
    }
    // ... etc
    await popup.close()

    // Then the document appears in the Delius document list
    await expect(page.locator('#documentListForm\\:documentTable a.last')).toContainText('open in pre-sentence service')

    // And the PDF appears in non-DRAFT form in the subject access report zip file
    await createSubjectAccessReport(page, crn, `downloads/${crn}-sar.zip`)
    const file = await getFileFromZip(`downloads/${crn}-sar.zip`, /shortFormatPreSentenceReport-.+?\.pdf/)
    const pdfText = await getPdfText(file)
    await expect(pdfText).not.toContain('DRAFT')
})

export const getPdfText = async (file: Buffer) =>
    await new Promise<string>((resolve, reject) => {
        const pdf = new PDFParser()
        const textContent: Array<string> = []
        pdf.on('data', async page => {
            if (page == null) {
                resolve(textContent.join()) // all pages parsed, return the content
            } else {
                textContent.push(page.Texts.flatMap(t => t.R).map(t => t.T)) // new page, add text content to array
            }
        })
        pdf.on('error', reject)
        pdf.parseBuffer(file)
    })
