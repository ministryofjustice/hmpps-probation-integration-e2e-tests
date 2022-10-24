import { expect, type Page } from '@playwright/test'
import { findContactsByCRN } from './find-contacts.js'
import { fillTime, selectOption } from '../utils/inputs.js'
import { waitForAjax } from '../utils/refresh.js'
import { data } from '../../../test-data/test-data.js'

export interface ContactOptions {
    crn: string
    relatedTo: string
    category: string
    type: string
    team: string
    staff: string
}

export const createContact = async (page: Page, options: ContactOptions) => {
    await findContactsByCRN(page, options.crn)
    await page.locator('input.btn', { hasText: 'Add Contact' }).first().click()
    await expect(page).toHaveTitle('Add Contact Details')

    await selectOption(page, '#addContactForm\\:RelatedTo', options.relatedTo)
    await Promise.all([selectOption(page, '#addContactForm\\:ContactCategory', options.category), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addContactForm\\:ContactType', options.type), waitForAjax(page)])
    await fillTime(page, '#addContactForm\\:StartTime', new Date())
    await fillTime(page, '#addContactForm\\:EndTime', new Date(new Date().getTime() + 60000))
    await Promise.all([selectOption(page, '#addContactForm\\:TransferToTeam', options.team), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addContactForm\\:Location'), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addContactForm\\:TransferToOfficer', options.staff), waitForAjax(page)])
    await page.locator('#addContactForm\\:saveButton').click()
    await expect(page).toHaveTitle(/Contact List/)
}

export const createInitialAppointment = async (page: Page, crn: string, eventNumber: string) =>
    createContact(page, {
        crn: crn,
        relatedTo: `Event ${eventNumber} - ORA Community Order (6 Months)`,
        ...data.contacts.initialAppointment,
    })
