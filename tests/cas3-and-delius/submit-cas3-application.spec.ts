import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as cas3Login } from '../../steps/cas3-accommodation/login'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { submitApplication } from '../../steps/cas2-short-term-accommodation/application'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'

dotenv.config() // read environment variables into process.env

const nomisIds = []

test('Submit a CAS3 application', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
//only add layer3 if required
    await cas3Login(page)//add cas3 login function
    await submitApplication(page, nomisId)//add submit cas3 application

    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('Person', 'CAS3 Referral Submitted')])
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})

