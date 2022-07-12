import {test} from "@playwright/test";
import {login} from "../../steps/delius/login";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {createEventForCRN} from "../../steps/delius/event/create-event";
import {createRequirementForEvent} from "../../steps/delius/requirement/create-requirement";
import {login as workforceLogin} from "../../steps/workforce/login";
import {allocateCase} from "../../steps/workforce/allocations";
import {verifyAllocation} from "../../steps/delius/offender/find-offender";
import {findContactsByCRN, verifyContacts} from "../../steps/delius/contact/find-contacts";
import {internalTransfer} from "../../steps/delius/transfer/internal-transfer";

test.beforeEach(async ({page}) => {
    await login(page)
})

const npsWales = "NPS Wales"
const wrexhamTeam = "NPS - Wrexham - Team 1"
const practitioner = {firstName: "Carlo", lastName: "Veo", providerName: npsWales, teamName: wrexhamTeam}

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
    await allocateCase(page, crn, practitioner)
    await verifyAllocation(page, {crn, practitioner})
    await findContactsByCRN(page, crn)

    const contacts = [
        {relatesTo: "Person", type: "Offender Manager Transfer", officer: practitioner},
        {relatesTo: "1 - Curfew (Curfew) (6 Weeks)", type: "Sentence Component Transfer", officer: practitioner},
        {relatesTo: "1 - ORA Community Order", type: "Order Supervisor Transfer", officer: practitioner}]
    await verifyContacts(page, contacts)

})

test("Allocate currently managed offender with community event and requirement", async ({page}) => {
    const crn = await createOffender(page, {providerName: npsWales})
    await createEventForCRN(page, {
        crn,
        providerName: npsWales,
        teamName: wrexhamTeam,
        appearanceType: "Appeal",
        outcome: "Order to Continue"
    })

    await internalTransfer(page, {crn,staffName:"Rees, Mark (NPS - PO)", providerName: npsWales,teamName: wrexhamTeam,reason: "Initial Allocation"})

    await createEventForCRN(page, {
        crn,
        providerName: npsWales,
        teamName: wrexhamTeam,
        appearanceType: "Sentence",
        outcome: "ORA Community Order",
        length: "6"
    })

    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)
    await verifyAllocation(page, {crn, practitioner})

})
