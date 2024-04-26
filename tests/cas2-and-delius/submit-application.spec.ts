import {test} from '@playwright/test'
import * as dotenv from 'dotenv'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as cas2Login } from '../../steps/cas2-short-term-accommodation/login'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { submitApplication } from '../../steps/cas2-short-term-accommodation/application'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'

dotenv.config() // read environment variables into process.env

const nomisIds = []

test('Submit a CAS2 short-term accommodation application', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson({ sex: 'Male' })
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    await cas2Login(page)
    await submitApplication(page, nomisId)

    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('Person', 'CAS2 Referral Submitted')])
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
