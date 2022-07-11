import {Page, expect} from "@playwright/test";

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