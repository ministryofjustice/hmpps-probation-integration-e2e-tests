import {expect, Page} from "@playwright/test";
// @ts-ignore
import dotenv from "dotenv";
import {Practitioner} from "../utils/person";
import {refreshUntil} from "../utils/refresh";


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
    await page.click("id=SearchForm:searchButton");

    await page.locator("tr", {hasText: crn})
        .locator("a", {hasText: "View"})
        .click();
    await expect(page).toHaveTitle(/Case Summary/);
}

export async function verifyAllocation(page: Page, args: { practitioner: Practitioner, crn: string }) {
    dotenv.config()
    await page.goto(process.env.DELIUS_URL)

    await findOffenderByCRN(page, args.crn)

    const locator = await page.locator("a:right-of(:text('Community Manager:'))",
        {hasText: `${args.practitioner.lastName}, ${args.practitioner.firstName}`}).first()

    await refreshUntil(page, async () => {
        return await locator.count() > 0
    })

    await expect(await locator.textContent())
        .toEqual(`${args.practitioner.lastName}, ${args.practitioner.firstName}`)
}
