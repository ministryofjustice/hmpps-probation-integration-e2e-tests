import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as sarLogin } from '../../steps/subject-access-request/login'
import { requestSarReportForCrn } from '../../steps/subject-access-request/application'
import { getPdfText } from '../../steps/delius/utils/pdf-utils'
import * as fs from 'fs'

const nomisIds: string[] = []

test('Verify SAR report correctly includes subject details from Delius using CRN', async ({ page }) => {
    // Step 1: Log in to Delius and create a new offender
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // Step 2: Create and book a prisoner in NOMIS
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Step 3: Log in to SAR and request a new SAR report
    await sarLogin(page)
    await requestSarReportForCrn(page, crn)

    // Step 4: Verify the CRN and Person's full name appear in the SAR PDF
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('a', { hasText: 'View report' }).click(),
    ])
    await download.saveAs(`downloads/${crn}-sar.pdf`)
    const pdfText = await getPdfText(await fs.promises.readFile(`downloads/${crn}-sar.pdf`))
    expect(pdfText).toContain(crn)
    expect(pdfText).toContain(person.firstName)
    expect(pdfText).toContain(person.lastName.toUpperCase())
})

test.afterAll(async () => {
    // Clean up by releasing all booked prisoners
    await Promise.all(nomisIds.map(nomisId => releasePrisoner(nomisId)))
})
