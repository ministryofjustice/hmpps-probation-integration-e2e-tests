import {expect, test} from "@playwright/test";
import {login as dpsLogin} from "../../steps/dps/login";
import {login as deliusLogin} from "../../steps/delius/login";
import {selectOption} from "../../steps/delius/utils/inputs";
import {findOffenderByNomisId} from "../../steps/delius/offender/find-offender";
import {contact} from "../../steps/delius/utils/contact";
import {verifyContacts} from "../../steps/delius/contact/find-contacts";

test.beforeEach(async ({page}) => {

})


test("Create a new case note", async ({page}) => {
    await dpsLogin(page)
    const nomisId = "A8613DY"
    await page.goto(`${process.env.DPS_URL}/prisoner/${nomisId}/add-case-note`)
    await expect(page).toHaveTitle(/Add a case note - Digital Prison Services/)

    await selectOption(page, "id=type", "General")
    await selectOption(page, "id=sub-type", "Offender Supervisor Entry")
    await page.fill("id=text","some text")
    await page.locator("button", {hasText: "Save"}).click()
    await expect(page).toHaveTitle(/Case notes - Digital Prison Services/)
    await page.goto(`${process.env.DPS_URL}/auth/sign-out`)

    await deliusLogin(page)
    const crn = await findOffenderByNomisId(page,nomisId)

    const contacts = [
        contact("1 - CJA - Std Determinate Custody", "Case Notes")
    ]
    await verifyContacts(page, crn, contacts)


})



