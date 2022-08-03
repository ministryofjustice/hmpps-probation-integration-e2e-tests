import {expect, Page} from "@playwright/test";
import {faker} from "@faker-js/faker";
import {findOffenderByCRN} from "../offender/find-offender";
import {fillDate, selectOption} from "../utils/inputs";
import {Yesterday} from "../utils/date-time";
import {data} from "../../../test-data/test-data"

const autoAddComponent = ["ORA Community Order"]

export interface CreateEvent {
    crn: string;
    allocation?: {
        providerName?: string
        teamName?: string;
        staffName?: string;
    };
    event?: {
        appearanceType?: string;
        outcome?: string;
        length?: string
    }
}

export async function createEventForCRN(page: Page, {crn, allocation = {}, event}: CreateEvent) {
    await findOffenderByCRN(page, crn)
    await page.click("id=linkNavigation2EventList")
    await expect(page).toHaveTitle(/Events/)
    await page.locator("input", {hasText: "Add"}).click()
    const date = faker.date.recent(1, Yesterday())
    await fillDate(page, "id=ReferralDate", date)
    await fillDate(page, "id=OffenceDate", date)
    await fillDate(page, "id=ConvictionDate", date)
    await selectOption(page, "#MainOffence")
    await selectOption(page, "#Court")
    await selectOption(page, "id=addEventForm:Area", allocation.providerName)
    await selectOption(page, "id=addEventForm:Team", allocation.teamName)
    if (allocation.staffName) {
        await selectOption(page, "id=addEventForm:Staff", allocation.staffName)
    }
    await selectOption(page, "#AppearanceType", event.appearanceType)
    await selectOption(page, "#Plea")
    await selectOption(page, "id=addEventForm:Outcome", event.outcome)
    if (autoAddComponent.includes(event.outcome)) {
        await selectOption(page, "#OutcomeArea", allocation.providerName)
        await selectOption(page, "id=addEventForm:OutcomeTeam", allocation.teamName)
    }

    if (event.length) {
        await page.fill("id=addEventForm:Length", event.length)
    }

    await page.locator("input", {hasText: "Save"}).click()

    if (autoAddComponent.includes(event.outcome)) {
        await expect(page).toHaveTitle(/Add Components/)
    } else {
        await expect(page).toHaveTitle(/Event Details/)
    }

    return event
}

export async function createCustodialEvent(page: Page,
                                           {crn, allocation = {}, event = data.events.custodial}: CreateEvent) {
    return createEventForCRN(page, {crn, allocation, event})
}

export async function createCommunityEvent(page: Page,
                                           {crn, allocation = {}, event = data.events.community}: CreateEvent) {
    return createEventForCRN(page, {crn, allocation, event})
}
