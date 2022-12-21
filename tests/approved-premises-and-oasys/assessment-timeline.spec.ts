import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as oasysLogin } from '../../steps/oasys/login.js'
import { setProviderEstablishment as selectRegion } from '../../steps/oasys/set-provider-establishment.js'
import { clickSearch } from '../../steps/oasys/task-manager.js'
import { offenderSearchWithCRN as crnSearch } from '../../steps/oasys/offender-search.js'
import { clickCreateOffenderButton } from '../../steps/oasys/cms-offender-details.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import {
    clickCreateAssessmentButton,
    clickUpdateOffenderButton,
} from '../../steps/oasys/layer3-assessment/create-ofender.js'
import { clickOKForCRNAmendment } from '../../steps/oasys/layer3-assessment/crn-amendment.js'
import { createLayer3Assessment } from '../../steps/oasys/layer3-assessment/create-assessment.js'
import { clickCMSRecord } from '../../steps/oasys/layer3-assessment/cms-search-results.js'
import { clickCloseAssessment } from '../../steps/oasys/layer3-assessment/offender-information-layer3.js'
import { login as approvedPremisesLogin, navigateToApplications } from '../../steps/approved-premises/login.js'
import { enterCRN } from '../../steps/approved-premises/applications/enter-crn.js'
import { clickSaveAndContinue } from '../../steps/approved-premises/applications/confirm-details.js'
import { selectSentenceType } from '../../steps/approved-premises/applications/select-sentence-type.js'
import { selectReleaseDateKnownStatus } from '../../steps/approved-premises/applications/release-date-known-status.js'
import { selectAPPlacementPurpose } from '../../steps/approved-premises/applications/ap-placement-purpose.js'
import { selectSituationOption } from '../../steps/approved-premises/applications/select-situation-option.js'
import { confirmPlacementStartdate } from '../../steps/approved-premises/applications/placement-start-date.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'

const nomisIds = []
test('Create a Layer 3 Assessment in OASys and verify this assessments can be read by Approved Premises', async ({
    page,
}) => {
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    // And I create an event in nDelius
    await createCustodialEvent(page, { crn })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    //And I log in to OASys as a "OASYS_T2_LOGIN_USER" user
    await oasysLogin(page)
    //And I select "Warwickshire" from Choose Provider Establishment
    await selectRegion(page)
    //And I click on the Search button from the top menu
    await clickSearch(page)
    //And I enter the crn number and search
    await crnSearch(page, crn)
    // And I click on Create Offender button
    await clickCreateOffenderButton(page)
    //And I click on Create Assessment Button
    await clickCreateAssessmentButton(page)
    //And I say OK for CRN Amendment
    await clickOKForCRNAmendment(page)
    //And I click on CMS Record
    await clickCMSRecord(page)
    //And I update the offender
    await clickUpdateOffenderButton(page)
    //And I start creating Layer 3 Assessment
    await createLayer3Assessment(page)
    //And I leave the Assessment in "Open" Status and close it
    await clickCloseAssessment(page)
    //When I login in to Approved Premises
    await approvedPremisesLogin(page)
    //And I navigate to AP Applications
    await navigateToApplications(page)
    //And I enter the CRN & Submit
    await enterCRN(page, crn)
    //And I click on Save and Continue confirming the offender's details
    await clickSaveAndContinue(page)
    //And I select Sentence Type and click on Submit
    await selectSentenceType(page)
    //And I select "Referral for risk management" Option that describes the situation
    await selectSituationOption(page)
    //And I select that I know release date
    await selectReleaseDateKnownStatus(page)
    //And I confirm placement start date is same as release date
    await confirmPlacementStartdate(page)
    //Then I select "Public protection" as the purpose of the Approved Premises (AP) placement
    await selectAPPlacementPurpose(page)
    //Todo - Complete this test once the Approved completes their development which is currently underway
    test.fail()
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
