import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3AssessmentWithoutNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env

test('OPD assessment creates an event in Delius', async ({ page }) => {
    await loginDelius(page)
    const dob = faker.date.birthdate({ min: 20, max: 30, mode: 'age' })
    const person = deliusPerson({ sex: 'Male', dob: dob, lastName: null, firstName: null })
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })
    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn, person)
    await addLayer3AssessmentNeeds(page)
})
