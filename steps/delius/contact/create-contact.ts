import { expect, type Page } from '@playwright/test'
import { findContactsByCRN } from './find-contacts.js'
import { fillTime, selectOption, selectOptionAndWait } from '../utils/inputs.js'
import { Contact, data, Team } from '../../../test-data/test-data.js'
import { doUntil } from '../utils/refresh.js'

export const createContact = async (page: Page, crn: string, options: Contact) => {
    await findContactsByCRN(page, crn)
    await page.locator('input.btn', { hasText: 'Add Contact' }).first().click()
    await expect(page).toHaveTitle('Add Contact Details')
    await selectOptionAndWait(page, '#addContactForm\\:RelatedTo', options.relatesTo)
    await selectOptionAndWait(page, '#addContactForm\\:TransferToTrust', options.allocation?.team?.provider)
    await selectOptionAndWait(page, '#addContactForm\\:ContactCategory', options.category)
    await selectOptionAndWait(page, '#addContactForm\\:TransferToTeam', options.allocation?.team?.name)
    await selectOptionAndWait(page, '#addContactForm\\:ContactType', options.type)
    await selectOptionAndWait(page, '#addContactForm\\:Location', options.allocation?.team?.location)
    await fillTime(page, '#addContactForm\\:StartTime', new Date())
    await fillTime(page, '#addContactForm\\:EndTime', new Date(new Date().getTime() + 60000))
    await selectOptionAndWait(page, '#addContactForm\\:TransferToOfficer', options.allocation?.staff?.name)
    await doUntil(
        () => page.locator('#addContactForm\\:saveButton').click(),
        () => expect(page).toHaveTitle(/Contact List/)
    )
}

export const createInitialAppointment = async (page: Page, crn: string, eventNumber: string, team: Team) =>
    createContact(page, crn, {
        relatesTo: `Event ${eventNumber} - ORA Community Order (6 Months)`,
        allocation: { team: team },
        ...data.contacts.initialAppointment,
    })
