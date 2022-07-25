import {expect, Page} from "@playwright/test";
import {findOffenderByCRN} from "./find-offender";
import {selectOption} from "../utils/inputs";

export async function setNomisId(page: Page, crn: string, nomisId: string) {

    await findOffenderByCRN(page,crn)
    await page.click("id=linkNavigation2OffenderIndex")
    await expect(page).toHaveTitle(/Personal Details/)

    await page.locator("input", {hasText: "Update"}).click()
    await expect(page).toHaveTitle(/Update Personal Details/)
    await selectOption(page, "id=updateOffenderForm:identifierType", "NOMS")
    await page.fill("id=updateOffenderForm:identifierValue", nomisId);
    await page.locator("input", {hasText: "Add/Update"}).click()
    await page.locator("input", {hasText: "Save"}).click()
    await expect(page).toHaveTitle(/Personal Details/)
}
