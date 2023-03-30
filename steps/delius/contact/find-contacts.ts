import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { doUntil } from '../utils/refresh.js'
import { Contact } from '../../../test-data/test-data.js'

export async function findContactsByCRN(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await page.click('#linkNavigation1ContactList')
    await expect(page).toHaveTitle(/Contact List/)
}

export async function verifyContacts(page: Page, crn: string, contacts: Contact[]) {
    await findContactsByCRN(page, crn)
    for (const contact of contacts) {
        await verifyContact(page, contact)
    }
}

export async function verifyContact(page: Page, contact: Contact) {
    let matchingContactRecord = page.locator('tr', { hasText: contact.type }).nth(contact.instance)
    if (contact.outcome) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.outcome })
    }
    if (contact.attended) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.attended })
    }
    if (contact.complied) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.complied })
    }
    const contactSearchButton = page.locator('input.btn-primary', { hasText: 'Context Search' })
    await doUntil(
        () => contactSearchButton.click(),
        () => expect(matchingContactRecord).not.toHaveCount(0)
    )

    await expect(matchingContactRecord).toContainText(contact.relatesTo)
    await expect(matchingContactRecord).toContainText(contact.type)
    if (contact.allocation) {
        await expect(matchingContactRecord).toContainText(
            `${contact.allocation.staff.lastName}, ${contact.allocation.staff.firstName}`
        )
    }
}
