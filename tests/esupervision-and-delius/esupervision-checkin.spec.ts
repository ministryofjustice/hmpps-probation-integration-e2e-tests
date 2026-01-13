import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'

import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createCheckin, registerCaseInMPoP, reviewCheckinInMPoP } from '../../steps/manage-a-supervision/check-in'

const person = deliusPerson()
let crn: string

test('Check-in for an e-supervision appointment', async ({ page }) => {
    // Given a case in Delius with an active event
    await deliusLogin(page)
    crn = await createOffender(page, { person })
    await createCommunityEvent(page, { crn })

    // When the e-supervision case is registered in MPoP
    const uuid = await registerCaseInMPoP(page, person, crn)

    // And the person checks in for their appointment
    await createCheckin(page, uuid, person)

    // And a practitioner reviews their check-in in MPoP
    await reviewCheckinInMPoP(page, crn)

    // Then I can see the contact in Delius
    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('1 - ORA Community Order', 'Online check in completed')])
})
