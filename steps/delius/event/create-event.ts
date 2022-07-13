import {expect, Page} from "@playwright/test";
import {faker} from "@faker-js/faker";
import {findOffenderByCRN} from "../offender/find-offender";
import {fillDate, selectOption} from "../utils/inputs";
import {Yesterday} from "../utils/date-time";

const autoAddComponent = ["ORA Community Order"]

export async function createEventForCRN(
    page: Page,
    args: {
        crn: string
        providerName?: string
        teamName?: string
        staffName?: string
        appearanceType?: string
        outcome?: string
        length?: string
    }
) {
    await findOffenderByCRN(page, args.crn)
    await page.click("id=linkNavigation2EventList")
    await expect(page).toHaveTitle(/Events/)
    await page.locator("input", {hasText: "Add"}).click()
    const date = faker.date.recent(1, Yesterday())
    await fillDate(page, "id=ReferralDate", date)
    await fillDate(page, "id=OffenceDate", date)
    await fillDate(page, "id=ConvictionDate", date)
    await selectOption(page, "#MainOffence")
    await selectOption(page, "#Court")
    await selectOption(page, "id=addEventForm:Area", args.providerName)
    await selectOption(page, "id=addEventForm:Team", args.teamName)
    if(args.staffName){
        await selectOption(page, "id=addEventForm:Staff", args.staffName)
    }
    await selectOption(page, "#AppearanceType", args.appearanceType)
    await selectOption(page, "#Plea")
    await selectOption(page, "id=addEventForm:Outcome", args.outcome)
    if (autoAddComponent.includes(args.outcome)) {
        await selectOption(page, "#OutcomeArea", args.providerName)
        await selectOption(page, "id=addEventForm:OutcomeTeam", args.teamName)
    }

    if (args.length) {
        await page.fill("id=addEventForm:Length", args.length)
    }

    await page.locator("input", {hasText: "Save"}).click()

    if (autoAddComponent.includes(args.outcome)) {
        await expect(page).toHaveTitle(/Add Components/)
    } else {
        await expect(page).toHaveTitle(/Event Details/)
    }
}
