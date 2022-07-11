import {Page} from "@playwright/test";
import {findOffenderByName} from "./find-offender";
import {deliusPerson, Person} from "../utils/person";
import {fillDate, selectOption} from "../utils/inputs";

export async function createOffender(page: Page, args: { person?: Person, providerName?: string }): Promise<string> {
    const person = deliusPerson(args.person)
    await findOffenderByName(page, person.firstName, person.lastName)

    await page.locator("input", {hasText: "Add New Person"}).click()
    await selectOption(page, "text=Owning Provider", args.providerName)
    await page.fill("text=First Name", person.firstName);
    await page.fill("text=Surname", person.lastName);
    await selectOption(page, "text=Sex", person.gender)
    await fillDate(page, "text=Date of Birth", person.dob)
    await page.locator("input", {hasText: "Save"}).click()
    if (await page.locator(".prompt-warning").count() > 0) {
        await page.locator("input", {hasText: "Confirm"}).click()
    }
    await page.locator("main", {has: page.locator("h1", {hasText: "Personal Details"})})
    return await page.locator("text=Case Reference Number").textContent()
}
