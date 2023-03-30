import { expect, type Page } from '@playwright/test'
import { findContactsByCRN } from './find-contacts.js'
import { fillDate, fillTime, selectOptionAndWait } from '../utils/inputs.js'
import { Contact, data, Team } from '../../../test-data/test-data.js'
import { doUntil } from '../utils/refresh.js'

export const createContact = async (page: Page, crn: string, options: Contact) => {
    await findContactsByCRN(page, crn)
    await page.locator('input.btn', { hasText: 'Add Contact' }).first().click()
    await expect(page).toHaveTitle('Add Contact Details')
    if (options.date) {
        await fillDate(page, '#addContactForm\\:StartDate', options.date)
    }

    await selectOptionAndWait(page, '#addContactForm\\:RelatedTo', options.relatesTo)
    await selectOptionAndWait(page, '#addContactForm\\:ContactCategory', options.category)
    await selectOptionAndWait(page, '#addContactForm\\:ContactType', options.type)
    await selectOptionAndWait(page, '#addContactForm\\:TransferToTrust', options.allocation?.team?.provider)
    await selectOptionAndWait(page, '#addContactForm\\:TransferToTeam', options.allocation?.team?.name)

    if (options.allocation?.team?.location) {
        await selectOptionAndWait(page, '#addContactForm\\:Location', options.allocation?.team?.location)
    }
    if (options.startTime) {
        await fillTime(page, '#addContactForm\\:StartTime', options.startTime)
    }
    if (options.endTime) {
        await fillTime(page, '#addContactForm\\:EndTime', options.endTime)
    }
    await selectOptionAndWait(page, '#addContactForm\\:TransferToOfficer', options.allocation?.staff?.name)
    await doUntil(
        () => page.locator('#addContactForm\\:saveButton').click(),
        () => expect(page).toHaveTitle(/Contact List/)
    )
}

export const createInitialAppointment = async (page: Page, crn: string, eventNumber: string, team: Team = null) =>
    createContact(page, crn, {
        relatesTo: `Event ${eventNumber} - ORA Community Order (6 Months)`,
        allocation: { team: team },
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60000),
        ...data.contacts.initialAppointment,
    })
