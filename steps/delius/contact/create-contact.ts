import { expect, type Page } from '@playwright/test'
import { findContactsByCRN } from './find-contacts'
import { fillDate, fillTime, selectOption, selectOptionAndWait } from '../utils/inputs'
import { Contact, data, Team } from '../../../test-data/test-data'
import {doUntil} from '../utils/refresh'
import { Tomorrow } from '../utils/date-time'

export const createContact = async (page: Page, crn: string, options: Contact) => {
    await findContactsByCRN(page, crn)
    await page.locator('input.btn', { hasText: 'Add Contact' }).first().click()
    await expect(page).toHaveTitle('Add Contact Details')
    if (options.date) {
        await fillDate(page, '#StartDate\\:datePicker', options.date as Date)
    }

    await selectOptionAndWait(page, '#RelatedTo\\:selectOneMenu', options.relatesTo)
    await selectOptionAndWait(page, '#ContactCategory\\:selectOneMenu', options.category)
    await selectOptionAndWait(page, '#ContactType\\:selectOneMenu', options.type)
    await selectOptionAndWait(page, '#TransferToTrust\\:selectOneMenu', options.allocation?.team?.provider)
    await selectOptionAndWait(page, '#TransferToTeam\\:selectOneMenu', options.allocation?.team?.name)

    if (options.allocation?.team?.location) {
        await selectOption(page, '#Location\\:selectOneMenu', options.allocation?.team?.location)
    }
    if (options.startTime) {
        await fillTime(page, '#StartTime\\:timePicker', options.startTime)
    }
    if (options.endTime) {
        await fillTime(page, '#EndTime\\:timePicker', options.endTime)
    }
    await selectOption(page, '#TransferToOfficer\\:selectOneMenu', options.allocation?.staff?.name)

    await doUntil(
        () => page.locator('input[type="submit"].btn-primary').click(),
        () => expect(page).toHaveTitle(/Contact List/)
    )
}

export const createInitialAppointment = async (page: Page, crn: string, eventNumber: string, team: Team = null) =>
    createContact(page, crn, {
        relatesTo: `Event ${eventNumber} - ORA Community Order (6 Months)`,
        allocation: { team: team },
        date: Tomorrow,
        startTime: Tomorrow,
        endTime: new Date(Tomorrow.getTime() + 60000),
        ...data.contacts.initialAppointment,
    })
