import {Page} from "@playwright/test";
import {findOffenderByName} from "./find-offender";
import {deliusPerson, Person} from "../utils/person";
import {fillDate, selectOption} from "../utils/inputs";

export async function createOffender(page: Page, args: { person?: Person, providerName?: string }): Promise<string> {
    const person = deliusPerson(args.person)
    await findOffenderByName(page, person.firstName, person.lastName)

    await page.locator("input", {hasText: "Add New Person"}).click()
    await selectOption(page, "id=addOffenderForm:Trust", args.providerName)
    await page.fill("id=addOffenderForm:FirstName", person.firstName);
    await page.fill("id=addOffenderForm:Surname", person.lastName);
    await selectOption(page, "id=addOffenderForm:Sex", person.gender)
    await fillDate(page, "id=DateOfBirth", person.dob)
    await page.locator("input", {hasText: "Save"}).click()
    if (await page.locator(".prompt-warning").count() > 0) {
        await page.locator("input", {hasText: "Confirm"}).click()
    }
    await page.locator("main", {has: page.locator("h1", {hasText: "Personal Details"})})
    return await page.locator("id=SearchForm:crn").textContent()
}
