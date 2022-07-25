import {expect, Page} from "@playwright/test";
import {findOffenderByCRN} from "../offender/find-offender";
import {Contact} from "../utils/contact";
import {doUntil} from "../utils/refresh";

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
    await doUntil(page, async () => {
        return await locator.count() > 0
    }, async () => {
        await page.locator("input.btn-primary", {hasText: "Context Search"}).click();
        await new Promise(f => setTimeout(f, 1000));
    }, 30)
    const textArray = [contact.relatesTo, contact.type]
    if (contact.officer) {
        textArray.push(`${contact.officer.lastName}, ${contact.officer.firstName}`)
    }
    await expect(locator).toContainText(textArray)
}