import {expect, Page} from "@playwright/test";
import {findOffenderByCRN} from "../offender/find-offender";
import {Contact} from "../utils/contact";
import {refreshUntil} from "../utils/refresh";

export async function findContactsByCRN(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await page.click("id=linkNavigation1ContactList");
    await expect(page).toHaveTitle(/Contact List/);
}

export async function verifyContacts(page: Page, crn: string, contacts: Contact[]) {
    await findContactsByCRN(page, crn)
    for (const contact of contacts) {
        await verifyContact(page, contact)
    }
}

export async function verifyContact(page: Page, contact: Contact) {
    const locator = await page.locator("tr", {hasText: contact.type}).nth(contact.instance)
    await refreshUntil(page, async () => {
        return await locator.count() > 0
    }, 10)
    await expect(locator)
        .toContainText([contact.relatesTo, contact.type, `${contact.officer.lastName}, ${contact.officer.firstName}`])
}