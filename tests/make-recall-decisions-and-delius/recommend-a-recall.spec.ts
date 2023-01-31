import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { login as makeRecallDecisionsLogin } from '../../steps/make-recall-decisions/login.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { enableContactFeatureFlag } from '../../steps/make-recall-decisions/flags.js'
import { startRecommendation } from '../../steps/make-recall-decisions/start-recommendation.js'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { contact } from '../../steps/delius/utils/contact.js'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env

test('Make a recall recommendation', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()
    const name = person.firstName + ' ' + person.lastName
    const crn = await createOffender(page, { person })

    await makeRecallDecisionsLogin(page)
    await enableContactFeatureFlag(page)
    await startRecommendation(page, crn, name)

    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('Person', 'Recommendation Started (Recall or No Recall)')])
})
