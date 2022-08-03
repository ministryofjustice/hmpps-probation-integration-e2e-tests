import {expect, Page} from "@playwright/test";
import {Practitioner} from "../utils/person";
import {refreshUntil} from "../utils/refresh";
import {selectOption} from "../utils/inputs";


export async function findOffenderByName(page: Page, forename: string, surname: string) {
    await page.locator("a", {hasText: "National search"}).click();
    await expect(page).toHaveTitle(/National Search/);
    await page.fill("id=SearchForm:FirstName", forename);
    await page.fill("id=SearchForm:LastName", surname);
    await page.click("id=SearchForm:searchButton");
}

export async function findOffenderByCRN(page: Page, crn: string) {
    await page.locator("a", {hasText: "National search"}).click();
    await expect(page).toHaveTitle(/National Search/);
    await page.fill("id=SearchForm:CRN", crn);
    await selectOption(page, "id=otherIdentifier", "[Not Selected]")
    await page.click("id=SearchForm:searchButton");

    await page.locator("tr", {hasText: crn})
        .locator("a", {hasText: "View"})
        .click();
    await expect(page).toHaveTitle(/Case Summary/);
}

export async function findOffenderByNomisId(page: Page, nomisId: string): Promise<string> {
    await page.locator("a", {hasText: "National search"}).click();
    await expect(page).toHaveTitle(/National Search/);
    await selectOption(page, "id=otherIdentifier", "NOMS Number")
    await page.fill("id=SearchForm:NOMSNumber",nomisId)
    await page.click("id=SearchForm:searchButton");

    await page.locator("tr", {hasText: ""})
        .locator("a", {hasText: "View"})
        .click();
    await expect(page).toHaveTitle(/Case Summary/);
    return await page.locator('//*[contains(@title, "Case Reference Number")]').first().textContent()
}

export async function verifyAllocation(page: Page, args: { practitioner: Practitioner, crn: string }) {
    await page.goto(process.env.DELIUS_URL)

    await findOffenderByCRN(page, args.crn)

    const locator = await page.locator("a:right-of(:text('Community Manager:'))",
        {hasText: `${args.practitioner.lastName}, ${args.practitioner.firstName}`}).first()

    await refreshUntil(page, async () => {
        return await locator.count() > 0
    },60)

    await expect(await locator.textContent())
        .toEqual(`${args.practitioner.lastName}, ${args.practitioner.firstName}`)
    await page.locator("a", {hasText: "Community Supervisor"}).click();
    await expect(page.locator("id=SearchForm:provider")).toHaveText(args.practitioner.providerName)
    await expect(page.locator("id=SearchForm:supervisorCommunityTeam")).toHaveText(args.practitioner.teamName)
}
