import {expect, Page} from "@playwright/test";
import {findOffenderByCRN} from "../offender/find-offender";
import {fillDate, selectOption} from "../utils/inputs";
import {faker} from "@faker-js/faker";

export async function terminateEvent(page: Page, crn: string, eventNumber: string, reason: string,) {
    await findOffenderByCRN(page, crn)
    await page.click("id=linkNavigation2EventList");
    await expect(page).toHaveTitle(/Events/);
    await page.locator("tr", {hasText: eventNumber})
        .locator("a", {hasText: "terminate"})
        .click();

    await expect(page).toHaveTitle(/Terminate Event/);
    await fillDate(page, "id=terminateEventForm:Terminated", faker.date.recent())
    await selectOption(page, "id=TermReason", reason)
    await page.locator("input", {hasText: "Terminate"}).click();
    if (await page.locator(".prompt-warning").count() > 0) {
        await page.locator("input", {hasText: "Confirm"}).click()
    }
    await expect(page).toHaveTitle(/Events/);

}