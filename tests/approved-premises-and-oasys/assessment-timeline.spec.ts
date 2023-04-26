import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as oasysLogin, UserType } from '../../steps/oasys/login.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import {
    clickChooseSectionsOfOASysToImportLink,
    navigateToTaskListPage,
    verifyRoshScoresAreAsPerOasys,
} from '../../steps/approved-premises/applications/task-list.js'
import { selectNeedsAndSubmit } from '../../steps/approved-premises/applications/import-oasys-sections.js'
import { verifyRoSHSummaryIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-rosh.js'
import { data } from '../../test-data/test-data.js'
import { verifyRMPInfoIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-rmp.js'
import { verifyOffenceAnalysisIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-offence-analysis.js'
import { verifyRiskToSelfIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-risk-to-self.js'
import { verifySupportingInfoIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-supporting-info.js'
import { createLayer3AssessmentWithoutNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs.js'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs.js'

const nomisIds = []

test('Create a Layer 3 Assessment in OASys and verify this assessments can be read by Approved Premises', async ({
    page,
}) => {
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

    // And I log in to OASys as a "OASYS_T2_LOGIN_USER" user
    await oasysLogin(page, UserType.Timeline)

    // And I create a Layer 3 Assessment without Needs in OASys
    await createLayer3AssessmentWithoutNeeds(page, crn)

    // And I add Needs for Layer 3 Assessment
    await addLayer3AssessmentNeeds(page, crn)

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
