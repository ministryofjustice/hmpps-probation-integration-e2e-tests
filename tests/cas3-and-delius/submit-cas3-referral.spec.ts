import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as cas3Login } from '../../steps/cas3-transitional-accommodation/login'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { submitCAS3Referral } from '../../steps/cas3-transitional-accommodation/application'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import { slow } from '../../steps/common/common'

dotenv.config() // read environment variables into process.env

const nomisIds = []

test('Submit a Transitional Accommodation CAS3 referral', async ({ page }) => {
    slow()

    // Step 1: Log in to Delius
    await deliusLogin(page)

    // Step 2: Create a person/offender in Delius
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // Step 3: Create a custodial event in Delius
    await createCustodialEvent(page, { crn })

    // Step 4: Create and Book prisoner
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Step 5: Log in to CAS3 and submit a CAS3 referral
    await cas3Login(page)
    await submitCAS3Referral(page, crn)

    // Step 6: Log back in to Delius to verify contacts
    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('Person', 'CAS3 Referral Submitted')])
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
