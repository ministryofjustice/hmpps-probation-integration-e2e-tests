import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import {
    clickChooseSectionsOfOASysToImportLink,
    navigateToTaskListPage,
    verifyRoshScoresAreAsPerOasys,
} from '../../steps/cas1-approved-premises/applications/task-list'
import { selectNeedsAndSubmit } from '../../steps/cas1-approved-premises/applications/import-oasys-sections'
import { verifyRoSHSummaryIsAsPerOASys } from '../../steps/cas1-approved-premises/applications/edit-risk-information-rosh'
import { data } from '../../test-data/test-data'
import { verifyRMPInfoIsAsPerOASys } from '../../steps/cas1-approved-premises/applications/edit-risk-information-rmp'
import { verifyOffenceAnalysisIsAsPerOASys } from '../../steps/cas1-approved-premises/applications/edit-risk-information-offence-analysis'
import { verifyRiskToSelfIsAsPerOASys } from '../../steps/cas1-approved-premises/applications/edit-risk-information-risk-to-self'
import { verifySupportingInfoIsAsPerOASys } from '../../steps/cas1-approved-premises/applications/edit-risk-information-supporting-info'
import { createLayer3AssessmentWithoutNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'

const nomisIds = []

test('View OASys assessments in Approved Premises service', async ({ page }) => {
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

    // And I create a Layer 3 Assessment with Needs in OASys
    await oasysLogin(page, UserType.Timeline)
    await createLayer3AssessmentWithoutNeeds(page, crn)
    await addLayer3AssessmentNeeds(page)

    // When I login in to Approved Premises and navigate to Applications Task-list page
    await navigateToTaskListPage(page, crn)

    // And I Verify that the "RoSH Risk scores" in the RoSH Widget are as per OASys
    await verifyRoshScoresAreAsPerOasys(page)

    // And I click on "Choose sections of OASys to import" link
    await clickChooseSectionsOfOASysToImportLink(page)

    // And I select the "Needs" related to the offender
    await selectNeedsAndSubmit(page)

    // Then I verify that "RoSH Summary", "Risk Management Plan", "Offence Analysis", "Risk to Self" information &  "Supporting Information"  is as per the OASys
    await verifyRoSHSummaryIsAsPerOASys(page)
    await verifyRMPInfoIsAsPerOASys(page)
    await verifyOffenceAnalysisIsAsPerOASys(page)
    await verifyRiskToSelfIsAsPerOASys(page)
    await verifySupportingInfoIsAsPerOASys(page)
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
