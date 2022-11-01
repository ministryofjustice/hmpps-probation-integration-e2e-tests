import { expect, Page, test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin } from '../../steps/oasys/login'
import { setProviderEstablishment as selectRegion } from '../../steps/oasys/set-provider-establishment'
import { clickSearch } from '../../steps/oasys/task-manager'
import { offenderSearchWithCRN as crnSearch } from '../../steps/oasys/offender-search'
import { clickCreateOffenderButton } from '../../steps/oasys/cms-offender-details'
import { clickCreateRSRAssessmentButton } from '../../steps/oasys/offender-details'
import { inputRSRScoreAnswers, verifyRSRScoreGeneration } from '../../steps/oasys/offender-rsr-score '
import { createEvent } from '../../steps/delius/event/create-event'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { verifyRsrScore } from '../../steps/delius/oasys-rsr-score/verify-rsr-score'

test('Create a standalone RSR Assessment in OASys and verify the RSR Score in nDelius', async ({ page }) => {
    //Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    //And I create an event in nDelius
    await createEvent(page, { crn, event: data.events.adjournedForFastPreSentenceReport })
    //Given I log in to OASys as a "OASYS_T2_LOGIN_USER" user
    await oasysLogin(page)
    //And I select "Warwickshire" from Choose Provider Establishment
    await selectRegion(page)
    //And I click on the Search button from the top menu
    await clickSearch(page)
    //And I enter the crn number and search
    await crnSearch(page, crn)
    //And I click on Create Offender button
    await clickCreateOffenderButton(page)
    //And I click on RSR Button
    await clickCreateRSRAssessmentButton(page)
    //And I enter the answers for RSR Score and Click on "Generate Score"
    await inputRSRScoreAnswers(page)
    //Then I see RSR Score is generated
    await verifyRSRScoreGeneration(page)
    const score = await verifyRSRScoreGeneration(page)
    //And login to nDelius
    await deliusLogin(page)
    //And I Search the RSR Standalone assessed offender with CRN
    await findOffenderByCRN(page, crn)
    //And I verify the RSR Score in nDelius matches OASys RSR for this offender
    await verifyRsrScore(page, score)
})
