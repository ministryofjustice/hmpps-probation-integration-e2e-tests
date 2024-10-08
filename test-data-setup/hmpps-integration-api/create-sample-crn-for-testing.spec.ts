import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAnAlert, createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { deliusPerson } from '../../steps/delius/utils/person'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import {
    createLayer3AssessmentWithoutNeeds,
    createLayer3CompleteAssessment,
} from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { createCustodialEvent } from '../../steps/delius/event/create-event'

test('create a crn for DPS and Delius with address and alert data', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    //Probation Data
    const address = buildAddress()
    await createAddress(page, crn, address)

    //DPS data
    const { nomisId, bookingId } = await createAndBookPrisoner(page, crn, person)
    await createAnAlert(bookingId, { alertType: 'X', alertCode: 'XEL', comment: 'has a large poster on cell wall' })

    //Clear the Probation reception
    await releasePrisoner(nomisId)
})

test('create a crn for Probation, with a layer 3 assessment in the incomplete state', async ({ page }) => {
    //Generate an offender
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    //Print the ids into the test report log for ease of finding them.
    console.log(crn, person)

    //Oasys - Risks, Scores and Needs data
    await createCustodialEvent(page, { crn }) // required for OASys login to be able to create assessment
    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn)
    await addLayer3AssessmentNeeds(page)
    //Steps after this point to close an assessment must be manually completed.
})

test('create a crn for Probation, with a layer 3 assessment with high RoSH Scores', async ({ page }) => {
    //Generate an offender
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    //Print the ids into the test report log for ease of finding them.
    console.log(crn, person)

    //Oasys - Risks, Scores and Needs data
    await createCustodialEvent(page, { crn })
    await oasysLogin(page, UserType.Booking)
    await createLayer3CompleteAssessment(page, crn, person, undefined, true)
    await addLayer3AssessmentNeeds(page)
})
