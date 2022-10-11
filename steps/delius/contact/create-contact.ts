import { expect, Page } from '@playwright/test'
import { findContactsByCRN } from './find-contacts'
import { fillTime, selectOption } from '../utils/inputs'
import { waitForAjax } from '../utils/refresh'

export const createContact = async (page: Page, crn: string) => {
    await findContactsByCRN(page, crn)
    await page.locator('input.btn', { hasText: 'Add Contact' }).first().click()
    await expect(page).toHaveTitle('Add Contact Details')
    await selectOption(page, '#addContactForm\\:RelatedTo', 'Event 1 - ORA Community Order (6 Months)')
    await Promise.all([selectOption(page, '#addContactForm\\:ContactCategory', 'All/Always'), waitForAjax(page)])
    await Promise.all([
        selectOption(page, '#addContactForm\\:ContactType', 'Initial Appointment (NS)'),
        waitForAjax(page),
    ])
    await fillTime(page, '#addContactForm\\:StartTime', new Date())
    await fillTime(page, '#addContactForm\\:EndTime', new Date(new Date().getTime() + 60000))
    await Promise.all([
        selectOption(page, '#addContactForm\\:TransferToTeam', 'Unallocated Team(N03)'),
        waitForAjax(page),
    ])
    await Promise.all([selectOption(page, '#addContactForm\\:Location'), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addContactForm\\:TransferToOfficer', 'Unallocated'), waitForAjax(page)])
    await page.locator('#addContactForm\\:saveButton').click()
    await expect(page).toHaveTitle(/Contact List/)
}
