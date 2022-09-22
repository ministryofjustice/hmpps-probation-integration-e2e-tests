import { expect, Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender'
import { Contact } from '../utils/contact'
import { doUntil } from '../utils/refresh'

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
    const matchingContactRecord = page.locator('tr', { hasText: contact.type }).nth(contact.instance)
    const contactSearchButton = page.locator('input.btn-primary', { hasText: 'Context Search' })
    await doUntil(
        () => contactSearchButton.click(),
        () => expect(matchingContactRecord).not.toHaveCount(0)
    )

    const textArray = [contact.relatesTo, contact.type]
    if (contact.officer) {
        textArray.push(`${contact.officer.lastName}, ${contact.officer.firstName}`)
    }
    await expect(matchingContactRecord).toContainText(textArray[0])
    await expect(matchingContactRecord).toContainText(textArray[1])
    await expect(matchingContactRecord).toContainText(textArray[2])

}
