import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { login as accreditedProgrammesLogin } from '../../steps/accredited-programmes/login.js'
import {
    assertRoSHRiskTable,
    briefOffenceDetailsSummaryCard,
    clickOnOffenderLink,
    findProgrammeAndMakeReferral,
    verifyAssessmentDateTextToBe,
} from '../../steps/accredited-programmes/application.js'

import { apFormattedTodayDate as todaysDate } from '../../steps/accredited-programmes/application.js'

const nomisIds = []

test('View OASys assessments in Accredited Programmes service', async ({ page }) => {
    test.slow()
    // Step 1: Create new Offender & event in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })

    // Step 2: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Step 3: Create a Layer 3 Assessment in OASys
    await oasysLogin(page, UserType.AccreditedProgrammesAssessment)
    await createLayer3CompleteAssessment(page, crn, person, nomisId)
    await addLayer3AssessmentNeeds(page)

    // Step 4: Make referral in Accredited Programmes
    await accreditedProgrammesLogin(page)
    await findProgrammeAndMakeReferral(page, nomisId)

    // Step 5: Verify OASys assessment data in Accredited Programmes service
    await clickOnOffenderLink(page, 'Date referred', `${person.firstName} ${person.lastName}`)
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Referral to Becoming New Me Plus: sexual offence/)
    await page.getByRole('link', { name: 'Risks and needs' }).click()
    await verifyAssessmentDateTextToBe(page, `Assessment completed ${todaysDate}`)
    await page.getByRole('link', { name: 'Risks and alerts' }).click()
    await assertRoSHRiskTable(page, {
        riskToChildren: 'Very high',
        riskToPublic: 'Medium',
        riskToKnownAdult: 'High',
        riskToStaff: 'Medium',
        riskToPrisoners: 'Not applicable',
    })
    await page.getByRole('link', { name: 'Section 2 - Offence analysis' }).click()
    await expect(page.locator(briefOffenceDetailsSummaryCard)).toContainText(
        'High Rosh risk to Partners, Medium Rosh risk to male peers & children'
    )
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
