import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { updateCustodyDates } from '../../steps/api/dps/prison-api'
import { findCustodyForEventByCRN, verifyKeyDates } from '../../steps/delius/event/find-events'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import { data } from '../../test-data/test-data'
import {formatDate} from "../../steps/delius/utils/date-time"

test('Update Custody Key Dates', async ({ page }) => {
    await deliusLogin(page)
    await findCustodyForEventByCRN(page, data.prisoners.sentencedPrisoner.crn, 1)
    const id = await page.locator('label', { hasText: 'Sentence Expiry Date:' }).getAttribute('for')
    const currentDate = await page.locator(`[id="${id}"]`).innerText()
    const dateParts = currentDate.split('/')
    const date = new Date()
    date.setDate(Number(dateParts[0]))
    date.setMonth(Number(dateParts[1]) - 1)
    date.setFullYear(Number(dateParts[2]))
    date.setUTCDate(date.getUTCDate() + 1)

    await updateCustodyDates(data.prisoners.sentencedPrisoner.bookingId, {
        sentenceExpiryDate: formatDate(date, 'yyyy-MM-dd'),
        conditionalReleaseDate: formatDate(date, 'yyyy-MM-dd'),
        licenceExpiryDate: formatDate(date, 'yyyy-MM-dd'),
        paroleEligibilityDate: formatDate(date, 'yyyy-MM-dd'),
    })

    await verifyKeyDates(page, data.prisoners.sentencedPrisoner.crn, 1, date)
    await verifyContacts(page, data.prisoners.sentencedPrisoner.crn, [
        contact('1 - Adult Custody 12m plus', 'Data Share Update Contact'),
    ])
})
