import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { createContact } from '../../steps/delius/contact/create-contact'
import { data } from '../../test-data/test-data'
import { DeliusDateFormatter, NextWeek, Tomorrow, Yesterday } from '../../steps/delius/utils/date-time'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { selectOption } from '../../steps/delius/utils/inputs'
import { login as hmppsAuthLogin } from '../../steps/hmpps-auth/login'
import fs from 'fs'
import { getPdfText } from '../../steps/delius/utils/pdf-utils'
import { refreshUntil } from '../../steps/delius/utils/refresh'

test('Create a breach notice', async ({ page }) => {
    // Given a case in Delius with an address, a community order, a requirement, and an enforceable contact
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createAddress(page, crn, buildAddress())
    await createCommunityEvent(page, { crn })
    await createRequirementForEvent(page, { crn })
    await createContact(page, crn, {
        relatesTo: `Event 1 - ORA Community Order (6 Months)`,
        date: Yesterday.toJSDate(),
        startTime: Yesterday.toJSDate(),
        endTime: new Date(Yesterday.toJSDate().getTime() + 60000),
        outcome: 'Unacceptable Absence',
        enforcementAction: 'Breach / Recall Initiated',
        allocation: { team: data.teams.allocationsTestTeam },
        ...data.contacts.initialAppointment,
    })
    await page.locator('tr:has-text("Unacceptable Absence")').getByRole('link', { name: 'view', exact: true }).click()

    // When I create a breach notice
    await createDocumentFromTemplate(page, 'Breach Notice Service')
    const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        await page.getByRole('link', { name: 'open in breach notice service' }).click(),
    ])
    await hmppsAuthLogin(popup)
    await expect(popup).toHaveTitle(/Breach Notice/)
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText(/Basic Details/)
    await selectOption(popup, '#alternate-reply-address')
    await popup.getByRole('textbox', { name: 'Date of letter' }).fill(DeliusDateFormatter(Tomorrow.toJSDate()))
    await popup.getByRole('textbox', { name: 'Office Reference (if any)' }).fill('testing')
    await popup.getByRole('button', { name: 'Continue' }).click()
    await popup.pause()
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText(/Warning Type/)
    await popup.getByRole('radio', { name: 'Breach Warning' }).check()
    await popup.getByRole('button', { name: 'Continue' }).click()
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText(/Warning Details/)
    await popup.getByRole('checkbox').check()
    await popup.getByRole('button', { name: 'Add Requirement' }).click()
    await popup.getByRole('checkbox', { name: 'Curfew (Police Checks Only' }).check()
    await selectOption(popup, '#conditional-failuresBeingEnforcedRequirements select')
    await popup.getByRole('button', { name: 'Save' }).click()
    await popup.getByRole('textbox', { name: 'Further reason details' }).fill('testing')
    await popup.getByRole('textbox', { name: 'Response Required By' }).fill(DeliusDateFormatter(NextWeek.toJSDate()))
    await popup.getByRole('button', { name: 'Continue' }).click()
    await expect(popup.getByRole('heading', { level: 1 })).toHaveText(/Next Appointment/)
    await popup.getByRole('radio', { name: 'No, I would like to use a different contact number' }).check()
    await popup.getByRole('textbox', { name: 'Phone number' }).fill('1234567890')
    await popup.getByRole('button', { name: 'Continue' }).click()
    await popup.getByRole('button', { name: 'Publish' }).click()
    await expect(popup.locator('#main-content')).toContainText('Letter Published')
    await popup.getByRole('link', { name: 'Close the Breach Notice' }).click()

    // Then the document is updated in Delius
    await refreshUntil(page, () => expect(page.getByRole('link', { name: 'view', exact: true })).toBeVisible())
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', { name: 'view', exact: true }).click(),
    ])
    await download.saveAs(`downloads/${crn}-breach-notice.pdf`)
    const pdf = await getPdfText(fs.readFileSync(`downloads/${crn}-breach-notice.pdf`))
    expect(pdf).toContain(crn)
})
