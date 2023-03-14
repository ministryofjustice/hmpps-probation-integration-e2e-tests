import {test} from '@playwright/test'
import * as dotenv from 'dotenv'
import {login as deliusLogin} from '../../steps/delius/login.js'
import {createOffender} from '../../steps/delius/offender/create-offender.js'
import {data} from '../../test-data/test-data.js'
import {deliusPerson} from '../../steps/delius/utils/person.js'
import {login as oasysLogin, UserType} from '../../steps/oasys/login.js'
import {setProviderEstablishment as selectRegion} from '../../steps/oasys/set-provider-establishment.js'
import {clickSearch} from '../../steps/oasys/task-manager.js'
import {offenderSearchWithCRN as crnSearch} from '../../steps/oasys/offender-search.js'
import {clickCreateOffenderButton} from '../../steps/oasys/cms-offender-details.js'
import {clickCreateRSRAssessmentButton} from '../../steps/oasys/offender-details.js'
import {inputRSRScoreAnswers, verifyRSRScoreGeneration} from '../../steps/oasys/offender-rsr-score .js'
import {createEvent} from '../../steps/delius/event/create-event.js'
import {findOffenderByCRN} from '../../steps/delius/offender/find-offender.js'
import {verifyRsrScore} from '../../steps/delius/oasys-rsr-score/verify-rsr-score.js'

dotenv.config() // read environment variables into process.env

test('Create a standalone RSR Assessment in OASys and verify the RSR Score in nDelius', async ({ page }) => {
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    // And I create an event in nDelius
    await createEvent(page, { crn, event: data.events.adjournedForFastPreSentenceReport })
    // Given I log in to OASys as a "OASYS_T2_LOGIN_USER" user
    await oasysLogin(page, UserType.Timeline)
    // And I select "Warwickshire" from Choose Provider Establishment
    await selectRegion(page)
    // And I click on the Search button from the top menu
    await clickSearch(page)
    // And I enter the crn number and search
    await crnSearch(page, crn)
    // And I click on Create Offender button
    await clickCreateOffenderButton(page)
    // And I click on RSR Button
    await clickCreateRSRAssessmentButton(page)
    // And I enter the answers for RSR Score and Click on "Generate Score"
    await inputRSRScoreAnswers(page)
    // Then I see RSR Score is generated
    await verifyRSRScoreGeneration(page)
    const score = await verifyRSRScoreGeneration(page)
    // And login to nDelius
    await deliusLogin(page)
    // And I Search the RSR Standalone assessed offender with CRN
    await findOffenderByCRN(page, crn)
    // And I verify the RSR Score in nDelius matches OASys RSR for this offender
    await verifyRsrScore(page, score)
})
