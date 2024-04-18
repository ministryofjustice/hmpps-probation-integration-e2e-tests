import { expect, type Page } from '@playwright/test'
import { findContactsByCRN } from './find-contacts'
import { fillDate, fillTime, selectOption, selectOptionAndWait } from '../utils/inputs'
import { Contact, data, Team } from '../../../test-data/test-data'
import { doUntil } from '../utils/refresh'
import { Tomorrow } from '../utils/date-time'
import { findOffenderByCRNNoContextCheck } from '../offender/find-offender.js'

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

    try {
        // Attempt to create contact
        await doUntil(
            async () => {
                await page.locator('input[type="submit"].btn-primary').click()
            },
            // Check if the page title matches "Contact List"
            async () => expect(page).toHaveTitle(/Contact List/),
            { timeout: 60_000, intervals: [500, 1000, 5000] }
        )
    } catch (error) {
        console.error('Error occurred while waiting for page title:', error)
        // Handle fallback in case of an error
        if ((await page.title()) === 'Error Page') {
            await findOffenderByCRNNoContextCheck(page, crn)
            return await createContact(page, crn, options)
        }

        if (!(await page.title()).includes('Contact List')) {
            await page.locator('#navigation-include\\:linkNavigation1ContactList').click()
        }
    }
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
