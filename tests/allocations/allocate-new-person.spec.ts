import {test} from "@playwright/test";
import {login} from "../../steps/delius/login";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {createEventForCRN} from "../../steps/delius/event/create-event";
import {createRequirementForEvent} from "../../steps/delius/requirement/create-requirement";
import {login as workforceLogin} from "../../steps/workforce/login";
import {allocateCase} from "../../steps/workforce/allocations";

test.beforeEach(async ({page}) => {
    await login(page)
})

const npsWales = "NPS Wales"
const wrexhamTeam = "NPS - Wrexham - Team 1"

test("Allocate new offender with community event and requirement", async ({page}) => {
    const crn = await createOffender(page, {providerName: npsWales})
    await createEventForCRN(page, {
        crn,
        providerName: npsWales,
        teamName: wrexhamTeam,
        appearanceType: "Sentence",
        outcome: "ORA Community Order",
        length: "6"
    })

    await createRequirementForEvent(page, {
        crn,
        eventNumber: "1",
        providerName: npsWales,
        teamName: wrexhamTeam,
        category: "Curfew",
        subCategory: "Curfew",
        length: "6"
    })

    await workforceLogin(page)
    await allocateCase(page, crn)
})
