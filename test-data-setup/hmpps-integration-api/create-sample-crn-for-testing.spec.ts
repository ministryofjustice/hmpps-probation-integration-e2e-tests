import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { deliusPerson } from '../../steps/delius/utils/person'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import {login as oasysLogin, UserType} from "../../steps/oasys/login";
import {
    createLayer3AssessmentWithoutNeeds
} from "../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs";
import {addLayer3AssessmentNeeds} from "../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs";
import {createCustodialEvent} from "../../steps/delius/event/create-event";

test('create a crn for DPS with an address and release them from Probation', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const address = buildAddress()
    await createAddress(page, crn, address)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    console.log(crn, person, nomisId)
    await releasePrisoner(nomisId)
})

test('create a crn for Probation, with a layer 3 assessment in the incomplete state', async ({ page }) => {
    //Generate an offender
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const address = buildAddress()

    //Print the ids into the test report log for ease of finding them.
    console.log(crn, person)

    //Oasys - Risks, Scores and Needs data
    await createCustodialEvent(page, {crn}) // required for OASys login to be able to create assessment
    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn)
    await addLayer3AssessmentNeeds(page)
})
