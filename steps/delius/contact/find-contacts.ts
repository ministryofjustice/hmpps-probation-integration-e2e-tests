import {expect, Page} from "@playwright/test";
import {findOffenderByCRN} from "../offender/find-offender";
import {Contact} from "../utils/person";

export async function findContactsByCRN(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await page.click("id=linkNavigation1ContactList");
    await expect(page).toHaveTitle(/Contact List/);
}

export async function verifyContacts(page: Page, contacts: Contact[]) {
    for (const contact of contacts){
        if(!contact.instance){
            contact.instance = 0
        }
        await verifyContact(page, contact)
    }
}
export async function verifyContact(page: Page, contact: Contact) {

    await expect(page.locator("tr", {hasText: contact.relatesTo}).nth(contact.instance))
        .toContainText([contact.relatesTo, contact.type, `${contact.officer.lastName}, ${contact.officer.firstName}`])

}