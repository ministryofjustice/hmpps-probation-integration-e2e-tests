import {Page} from "@playwright/test";
import {findEventByCRN} from "../event/find-events";
import {selectOption} from "../utils/inputs";

export async function createRequirementForEvent(
    page: Page,
    args: {
        crn: string,
        eventNumber: string,
        providerName?: string
        teamName?: string
    }
) {
    await findEventByCRN(page, args.crn, args.eventNumber)
    await page.click("id=linkNavigation3SentenceComponentREQ");
    await page.locator("main", {has: page.locator("h1", {hasText: "Requirement Types"})})
    await page.locator("input", {hasText: "Add"}).click();
    await selectOption(page, "id=RequirementMainCategory")
    await selectOption(page, "id=RequirementSubCategory")
    await selectOption(page, "id=Area", args.providerName)
    await selectOption(page, "id=AddSentenceComponentsForm:requirement:Team", args.teamName)
    await page.fill("id=Length", "6")
    await page.locator("input", {hasText: "Add"}).click();
    await page.locator("input", {hasText: "Save"}).click();
}