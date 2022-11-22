import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { data } from '../../test-data/test-data.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as oasysLogin } from '../../steps/oasys/login.js'
import { setProviderEstablishment as selectRegion } from '../../steps/oasys/set-provider-establishment.js'
import { clickSearch } from '../../steps/oasys/task-manager.js'
import { offenderSearchWithCRN as crnSearch } from '../../steps/oasys/offender-search.js'
import { clickCreateOffenderButton } from '../../steps/oasys/cms-offender-details.js'
import { clickCreateRSRAssessmentButton } from '../../steps/oasys/offender-details.js'
import { inputRSRScoreAnswers, verifyRSRScoreGeneration } from '../../steps/oasys/offender-rsr-score .js'
import { createEvent } from '../../steps/delius/event/create-event.js'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender.js'
import { verifyRsrScore } from '../../steps/delius/oasys-rsr-score/verify-rsr-score.js'
import {
    clickCreateAssessmentButton,
    clickUpdateOffenderButton
} from "../../steps/oasys/layer3-assessment/create-ofender.js";
import {clickOKForCRNAmendment} from "../../steps/oasys/layer3-assessment/crn-amendment.js";
import {createLayer3Assessment} from "../../steps/oasys/layer3-assessment/create-assessment.js";
import {clickCMSRecord} from "../../steps/oasys/layer3-assessment/cms-search-results.js";
import {clickCloseAssessment} from "../../steps/oasys/layer3-assessment/offender-information-layer3.js";

test('Create a Layer 3 Assessment in OASys and verify this assessments can be read by Approved Premises', async ({ page }) => {
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    //And I create an event in nDelius
    await createEvent(page, { crn, event: data.events.adjournedForFastPreSentenceReport })
    //Given I log in to OASys as a "OASYS_T2_LOGIN_USER" user
    // const crn = 'X582963';
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
})
