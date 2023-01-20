import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { login as makeRecallDecisionsLogin } from '../../steps/make-recall-decisions/login.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import { createRelease } from '../../steps/delius/release/create-release.js'
import { createLicenceCondition } from '../../steps/delius/licence-condition/create-licence-condition.js'
import { createAddress } from '../../steps/delius/address/create-address.js'
import { enableContactFeatureFlag } from '../../steps/make-recall-decisions/flags.js'
import { createRecommendation } from '../../steps/make-recall-decisions/create-recommendation.js'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { contact } from '../../steps/delius/utils/contact.js'

test('Make a recall recommendation', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()
    const name = person.firstName + ' ' + person.lastName
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })
    await createAddress(page, crn)
    await createRelease(page, crn)
    await createLicenceCondition(page, crn)

    await makeRecallDecisionsLogin(page)
    await enableContactFeatureFlag(page)
    await createRecommendation(page, crn, name)

    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('Person', 'Recommendation Started (Recall or No Recall)')])
})
