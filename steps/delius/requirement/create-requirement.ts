import {Page} from "@playwright/test";
import {data} from "../../../test-data/test-data";
import {findEventByCRN} from "../event/find-events";
import {selectOption} from "../utils/inputs";

export async function createRequirementForEvent(
    page: Page,
    {crn, eventNumber = "1", team = {}, requirement = data.requirements.curfew}: {
        crn: string,
        eventNumber?: string,
        team?: {
            providerName?: string,
            teamName?: string
        },
        requirement?: {
            category: string,
            subCategory: string,
            length?: string
        }
    }
) {
    await findEventByCRN(page, crn, eventNumber)
    await page.click("#linkNavigation3SentenceComponentREQ");
    await page.locator("main", {has: page.locator("h1", {hasText: "Requirement Types"})})
    await page.locator("input", {hasText: "Add"}).click();
    await selectOption(page, "#RequirementMainCategory", requirement.category)
    await selectOption(page, "#RequirementSubCategory", requirement.subCategory)
    await selectOption(page, "#Area", team.providerName)
    await selectOption(page, "#AddSentenceComponentsForm\\:requirement\\:Team", team.teamName)
    if (requirement.length) {
        await page.fill("#Length", requirement.length)
    }
    await page.locator("input", {hasText: "Add"}).click();
    await page.locator("input", {hasText: "Save"}).click();
}