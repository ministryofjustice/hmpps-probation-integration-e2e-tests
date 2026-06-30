import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { setProviderEstablishment as selectRegion } from '../../steps/oasys/set-provider-establishment'
import { clickSearch } from '../../steps/oasys/task-manager'
import { offenderSearchWithCRN as crnSearch } from '../../steps/oasys/offender-search'
import { clickCreateOffenderButton } from '../../steps/oasys/cms-offender-details'
import { clickCreateRSRAssessmentButton } from '../../steps/oasys/offender-details'
import { inputRSRScoreAnswers, verifyRSRScoreGeneration } from '../../steps/oasys/offender-rsr-score'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { verifyRsrScore } from '../../steps/delius/oasys-rsr-score/verify-rsr-score'

test('Create a standalone RSR Assessment', async ({ page }) => {
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // And I create an event in nDelius
    await createCustodialEvent(page, { crn })

    // Given I log in to OASys and create RSR Assessment
    await oasysLogin(page, UserType.RSR)
    await selectRegion(page)
    await clickSearch(page)
    await crnSearch(page, crn)
    await clickCreateOffenderButton(page)
    await clickCreateRSRAssessmentButton(page)
    await inputRSRScoreAnswers(page)
    await verifyRSRScoreGeneration(page)
    const score = await verifyRSRScoreGeneration(page)

    // And login to nDelius and verify the RSR Score in nDelius matches OASys RSR for this offender
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await verifyRsrScore(page, score)
})
