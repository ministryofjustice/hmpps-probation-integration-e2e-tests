import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { updateCustodyDates } from '../../steps/api/dps/prison-api.js'
import { verifyKeyDates } from '../../steps/delius/event/find-events.js'
import { v4 as uuid } from 'uuid'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { contact } from '../../steps/delius/utils/contact.js'
import { data } from '../../test-data/test-data.js'
import { commonData } from '../../test-data/environments/common.js'

test('Update Custody Key Dates', async ({ page }) => {
    await deliusLogin(page)

    const today = new Date()
    today.setFullYear(today.getFullYear() + 2)
    await updateCustodyDates(data.sentencedPrisoner.bookingId, {
        calculationUuid: uuid(),
        submissionUser: process.env.DPS_USERNAME,
        keyDates: {
            sentenceExpiryDate: today.toISOString().substring(0, 10),
            conditionalReleaseDate: today.toISOString().substring(0, 10),
            licenceExpiryDate: today.toISOString().substring(0, 10),
            paroleEligibilityDate: today.toISOString().substring(0, 10),
        },
    })

    await verifyKeyDates(page, data.sentencedPrisoner.crn, 1, today)
    await verifyContacts(page, data.sentencedPrisoner.crn, [
        contact(commonData.events.custodial.outcome, 'Data Share Update Contact'),
    ])
})
