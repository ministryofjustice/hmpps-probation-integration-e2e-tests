import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { selectOption } from '../../steps/delius/utils/inputs'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import { data } from '../../test-data/test-data'
import { faker } from '@faker-js/faker'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import StreamZip from 'node-stream-zip'
import PDFParser from 'pdf2json'

test.beforeEach(({ page }) => page.on('console', console.log))

test('Create a short format pre-sentence report', async ({ page }) => {
    // Given a person with an event that has been adjourned for pre-sentence report
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createEvent(page, { crn, event: data.events.adjournedForFastPreSentenceReport })
    // And a court report
    await page.locator('input', { hasText: 'Save' }).click()
    await page.locator('#linkNavigation3Reports').click()
    await expect(page).toHaveTitle(/Court And Institutional Reports/)
    await page.locator('#reportListForm\\:courtReportTable a', { hasText: 'view' }).click()
    await expect(page).toHaveTitle(/View Court Report/)
    // And a new pre-sentence report
    await page.locator('input', { hasText: 'Document' }).click()
    await selectOption(page, '#documentListForm\\:templateTypes', data.documentTemplates.shortFormatPreSentenceReport)
    await page.locator('input', { hasText: 'Create from Template' }).click()
    const popup = await page.waitForEvent('popup')
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Home/)

    // When I complete the pre-sentence report in the popup window
    // - Offender details
    await popup.locator('text=Start now').click()
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offender details/)
    await popup.locator('textarea[name="address"]').fill(faker.address.streetAddress(true))
    await popup.locator('input[name="pnc"]').fill(faker.random.alphaNumeric(10, { casing: 'upper' }))
    // - Sentencing court details
    await popup.locator('text=Save and continue').click() // FIXME this currently fails due to an error in pre-sentence-service
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Sentencing court details/)
    const dateOfHearing = faker.date.recent()
    await popup.locator('input[name="dateOfHearing-day"]').fill(dateOfHearing.getDate().toString())
    await popup.locator('input[name="dateOfHearing-month"]').fill((dateOfHearing.getMonth() + 1).toString())
    await popup.locator('input[name="dateOfHearing-year"]').fill(dateOfHearing.getFullYear().toString())
    // - Offence details
    await popup.locator('text=Save and continue').click()
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offence details/)
    for (const textarea of await popup.locator('textarea').elementHandles()) {
        await textarea.fill(faker.lorem.paragraphs())
    }
    // - Offence analysis
    await popup.locator('text=Save and continue').click()
    await expect(popup).toHaveTitle(/Short Format Pre-Sentence Report - Offence analysis/)
    for (const textarea of await popup.locator('textarea').elementHandles()) {
        await textarea.fill(faker.lorem.paragraphs())
    }
    // ... etc
    await popup.close()

    // Then the document appears in the Delius document list
    await expect(page.locator('#documentListForm\\:documentTable a.last')).toContainText('open in pre-sentence service')

    // And the PDF appears in the subject access report zip file (i.e. it has been uploaded to Alfresco)
    await page.locator('text=Close').click()
    await expect(page).toHaveTitle(/View Court Report/)
    await page.locator('text=Close').click()
    await expect(page).toHaveTitle(/Court And Institutional Reports/)
    await page.locator('#linkNavigation2SubjectAccessReportList').click()
    await page.locator('input', { hasText: 'New SAR' }).click()
    await page.locator('input', { hasText: 'Save' }).click()
    const sarProgressTable = page.locator('#sarListForm\\:subjectAccessReportTable')
    await refreshUntil(page, () => expect(sarProgressTable).toContainText('Complete'))
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        sarProgressTable.locator('a', { hasText: 'Download' }).click(),
    ])
    await download.saveAs(`downloads/${crn}-sar.zip`)
    const zip = new StreamZip.async({ file: `downloads/${crn}-sar.zip` })
    const files = Object.values(await zip.entries())
        .filter(entry => entry.isFile)
        .filter(entry => entry.name.startsWith('shortFormatPreSentenceReport') && entry.name.endsWith('.pdf'))
    expect(files).toHaveLength(1)

    // And the PDF does not contain the DRAFT label
    const file = await zip.entryData(files[0])
    await new Promise<void>((resolve, reject) => {
        const pdf = new PDFParser()
        pdf.on('data', async page => {
            if (page == null) {
                resolve() // all pages parsed
            } else {
                const pdfText = page.Texts.flatMap(t => t.R).map(t => t.T)
                await expect(pdfText).not.toContain('DRAFT')
            }
        })
        pdf.on('error', reject)
        pdf.parseBuffer(file)
    })
})
