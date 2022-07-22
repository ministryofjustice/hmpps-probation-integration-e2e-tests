import {expect, test} from "@playwright/test";
import {login as dpsLogin} from "../../steps/dps/login";
import {login as deliusLogin} from "../../steps/delius/login";
import {selectOption} from "../../steps/delius/utils/inputs";
import {contact} from "../../steps/delius/utils/contact";
import {verifyContacts} from "../../steps/delius/contact/find-contacts";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {createEventForCRN} from "../../steps/delius/event/create-event";
import {deliusPerson} from "../../steps/delius/utils/person";
import {setNomisId} from "../../steps/delius/offender/update-offender";
import {getToken} from "../../steps/api/auth/get-token";
import {createAndBookPrisoner} from "../../steps/api/dps/prison-api";


const npsWales = "NPS Wales"
const wrexhamTeam = "NPS - Wrexham - Team 1"
const person = deliusPerson()

test("Create a new case note", async ({page}) => {
    page.on('console', msg => console.log(msg))
    await deliusLogin(page)
    const crn = await createOffender(page, {person: person, providerName: npsWales})
    await createEventForCRN(page, {
        crn,
        providerName: npsWales,
        teamName: wrexhamTeam,
        appearanceType: "Sentence",
        outcome: "Adult Custody < 12m",
        length: "6"
    })

    const nomisId = await createAndBookPrisoner(person)
    console.log("nomis id",nomisId)
    await setNomisId(page, crn, nomisId )
    await page.goto(`${process.env.DPS_URL}/auth/sign-out`)

    //Add a case note
    await dpsLogin(page)
    await page.goto(`${process.env.DPS_URL}/prisoner/${nomisId}/add-case-note`)
    await expect(page).toHaveTitle(/Add a case note - Digital Prison Services/)
    await selectOption(page, "id=type", "General")
    await selectOption(page, "id=sub-type", "Offender Supervisor Entry")
    await page.fill("id=text","some text")
    await page.locator("button", {hasText: "Save"}).click()
    await expect(page).toHaveTitle(/Case notes - Digital Prison Services/)
    await page.goto(`${process.env.DPS_URL}/auth/sign-out`)
    //check the case note is created in delius
    await deliusLogin(page)

    const contacts = [
        contact("1 - CJA - Std Determinate Custody", "Case Notes")
    ]
    await verifyContacts(page, crn, contacts)
})



