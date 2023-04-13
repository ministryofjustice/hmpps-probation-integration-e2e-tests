import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import { data } from '../../test-data/test-data.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { startUPWAssessmentFromDelius } from '../../steps/delius/upw/start-upw-assessment.js'
import { login as unpaidWorkLogin } from '../../steps/unpaidwork/login.js'
import { submitUPWAssessment } from '../../steps/unpaidwork/task-list.js'
import { completeAllUPWSections } from '../../steps/unpaidwork/complete-all-upw-sections.js'
import { format } from 'date-fns'
import { doUntil } from '../../steps/delius/utils/refresh.js'
import * as fs from "fs";
import { getPdfText } from "../../steps/delius/utils/pdf-utils.js";

const nomisIds = []
test('Create a UPW-Assessment from Delius and verify the Pdf is uploaded back to Delius', async ({page}) => {
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    // And I create Supervision Community Event in Delius
    await createCommunityEvent(page, {
        crn,
        allocation: {team: data.teams.genericTeam, staff: data.staff.genericStaff},
    })
    // And I add a requirement for this event with the type called "unpaid work"
    await createRequirementForEvent(page, {
        crn,
        requirement: data.requirements.unpaidWork,
        team: data.teams.genericTeam,
    })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const {nomisId} = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    // And I start UPW Assessment from Delius
    const popup = await startUPWAssessmentFromDelius(page)

    // When I login to UPW and navigate to UPW Task List
    await unpaidWorkLogin(popup)
    // And I complete all the UPW Sections
    await completeAllUPWSections(popup)
    // And I submit UPW Assessment and close the UPW Popup
    await submitUPWAssessment(popup)

    // Then the document appears in the Delius document list
    await page.locator('a', { hasText: 'Document List' }).click()
    await doUntil(
        () => page.getByRole('button', { name: 'Search' }).click(),
        () => expect(page.locator('table')).toContainText('CP/UPW Assessment')
    )

    await expect(page.locator('#documentListForm\\:documentDrawerTable\\:tbody_element')).toContainText(
        format(new Date(), 'dd/MM/yyyy')
    )
    await expect(page.getByRole('link', { name: 'view document' })).toBeEnabled()

    // And I verify the content in the PDF (CRN)
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', {name: 'view document'}).click(),
    ])
    await download.saveAs(`downloads/${crn}-assessment.pdf`)
    const assessmentPdf = fs.readFileSync(`downloads/${crn}-assessment.pdf`)
    const pdfText = await getPdfText(assessmentPdf)
    await expect(pdfText).toContain(crn)
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
