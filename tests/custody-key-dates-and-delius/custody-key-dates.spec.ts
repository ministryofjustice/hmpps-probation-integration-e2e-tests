import {expect, test} from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { updateCustodyDates } from '../../steps/api/dps/prison-api.js'
import {findCustodyForEventByCRN, verifyKeyDates} from '../../steps/delius/event/find-events.js'
import { v4 as uuid } from 'uuid'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { contact } from '../../steps/delius/utils/contact.js'
import { data } from '../../test-data/test-data.js'
import { commonData } from '../../test-data/environments/common.js'

test('Update Custody Key Dates', async ({ page }) => {
    await deliusLogin(page)
    await findCustodyForEventByCRN(page, data.sentencedPrisoner.crn, 1)
    const id = await page.locator('label', { hasText: "Sentence Expiry Date:" }).getAttribute('for')
    const currentDate = await page.locator(`[id="${id}"]`).innerText()
    const dateParts = currentDate.split("/")
    const date = new Date()
    date.setDate(Number(dateParts[0]))
    date.setMonth(Number(dateParts[1]) - 1)
    date.setFullYear(Number(dateParts[2]))
    date.setUTCDate(date.getUTCDate() + 1)

    await updateCustodyDates(data.sentencedPrisoner.bookingId, {
        calculationUuid: uuid(),
        submissionUser: process.env.DPS_USERNAME,
        keyDates: {
            sentenceExpiryDate: date.toISOString().substring(0, 10),
            conditionalReleaseDate: date.toISOString().substring(0, 10),
            licenceExpiryDate: date.toISOString().substring(0, 10),
            paroleEligibilityDate: date.toISOString().substring(0, 10),
        },
    })

    await verifyKeyDates(page, data.sentencedPrisoner.crn, 1, date)
    await verifyContacts(page, data.sentencedPrisoner.crn, [
        contact(commonData.events.custodial.outcome, 'Data Share Update Contact'),
    ])
})
