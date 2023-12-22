import { test } from '@playwright/test'
import {login as deliusLogin} from "../../steps/delius/login";
import {findCustodyForEventByCRN} from "../../steps/delius/event/find-events";
import {data} from "../../test-data/test-data";
import {updateCustodyDates} from "../../steps/api/dps/prison-api";
import {format} from "date-fns";

test('update the hmpps integration api offender custody dates', async ({ page }) => {
    await deliusLogin(page)
    await findCustodyForEventByCRN(page, data.prisoners.hmppsPrisonerForCustodyUpdates.crn, 1)
    const id = await page.locator('label', { hasText: 'Sentence Expiry Date:' }).getAttribute('for')
    const currentDate = await page.locator(`[id="${id}"]`).innerText()
    const dateParts = currentDate.split('/')
    const date = new Date()
    date.setDate(Number(dateParts[0]))
    date.setMonth(Number(dateParts[1]) - 1)
    date.setFullYear(Number(dateParts[2]))
    date.setUTCDate(date.getUTCDate() + 1)

    await updateCustodyDates(data.prisoners.hmppsPrisonerForCustodyUpdates.bookingId, {
        sentenceExpiryDate: format(date, 'yyyy-MM-dd'),
        conditionalReleaseDate: format(date, 'yyyy-MM-dd'),
        conditionalReleaseOverrideDate: format(date, 'yyyy-MM-dd'),
        licenceExpiryDate: format(date, 'yyyy-MM-dd'),
        paroleEligibilityDate: format(date, 'yyyy-MM-dd'),
        topupSupervisionExpiryDate: format(date, 'yyyy-MM-dd'),
        homeDetentionCurfewEligibilityDate: format(date, 'yyyy-MM-dd'),
    })
})
