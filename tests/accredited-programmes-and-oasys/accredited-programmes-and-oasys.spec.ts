import { expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { data } from '../../test-data/test-data'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { login as accreditedProgrammesLogin } from '../../steps/accredited-programmes/login.js'
import {
    apFormattedDate,
    apFormattedTodayDate,
    assertRoSHRiskTable,
    findProgrammeAndMakeReferral,
    oasysImportDateText,
} from '../../steps/accredited-programmes/application.js'
import { parseISO } from 'date-fns'

import { apFormattedTodayDate as todaysDate } from '../../steps/accredited-programmes/application.js'

const nomisIds = []
// Set up the OASys record and confirm the details can be read in the Accredited Programmes
test('View OASys assessments in Accredited Programmes service', async ({ page }) => {
    test.slow() // increase the timeout - Delius/OASys/AP Applications can take a few minutes
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // And I create an event in nDelius
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })

    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    await oasysLogin(page, UserType.AccreditedProgrammesAssessment)
    await createLayer3CompleteAssessment(page, crn, person, nomisId)
    await addLayer3AssessmentNeeds(page)

    // When I login in to Accredited Programmes Login

    await accreditedProgrammesLogin(page)
    await findProgrammeAndMakeReferral(page, nomisId)

    // await page.getByRole('link', { name: 'My referrals' }).click()

    await clickOnOffenderLink(page, 'Date referred', `${person.firstName} ${person.lastName}`)
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Referral to Becoming New Me Plus: sexual offence/)

    await page.getByRole('link', { name: 'Risks and needs' }).click()
    await expect(page.locator(oasysImportDateText)).toHaveText(`Imported from OASys on ${todaysDate}.`)

    await page.getByRole('link', { name: 'Risks and alerts' }).click()
    await assertRoSHRiskTable(page, {
        riskToChildren: 'Very high',
        riskToPublic: 'Medium',
        riskToKnownAdult: 'High',
        riskToStaff: 'Medium',
        riskToPrisoners: 'Not applicable',
    })

    // Section 2 - Offence analysis
    await page.getByRole('link', { name: 'Section 2 - Offence analysis' }).click()

    await expect(page.locator('[data-testid="brief-offence-details-summary-card"]')).toContainText(
        'High Rosh risk to Partners, Medium Rosh risk to male peers & children'
    )
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
async function clickOnOffenderLink(page: Page, linkName: string, fullName: string) {
    // Click on 'Date referred' link first
    await page.getByRole('link', { name: linkName }).click()

    // Get the link with person's full name
    const nameLink = await page.getByRole('link', { name: fullName })

    // Check if the link is visible
    if (!(await nameLink.isVisible())) {
        // If not visible, click 'Date referred' again
        await page.getByRole('link', { name: linkName }).click()
    }

    // Click on the link with person's full name
    await nameLink.click()
}
