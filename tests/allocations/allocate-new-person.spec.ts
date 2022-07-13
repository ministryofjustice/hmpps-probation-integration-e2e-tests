import {test} from "@playwright/test";
import {login} from "../../steps/delius/login";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {createEventForCRN} from "../../steps/delius/event/create-event";
import {createRequirementForEvent} from "../../steps/delius/requirement/create-requirement";
import {login as workforceLogin} from "../../steps/workforce/login";
import {allocateCase} from "../../steps/workforce/allocations";
import {verifyAllocation} from "../../steps/delius/offender/find-offender";
import {verifyContacts} from "../../steps/delius/contact/find-contacts";
import {internalTransfer} from "../../steps/delius/transfer/internal-transfer";
import {terminateEvent} from "../../steps/delius/event/terminate-events";
import {contact} from "../../steps/delius/utils/contact";

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

    const contacts = [
        contact("Person", "Offender Manager Transfer", practitioner),
        contact("Person", "Responsible Officer Change", practitioner),
        contact("1 - Curfew (Curfew) (6 Weeks)", "Sentence Component Transfer", practitioner),
        contact("1 - ORA Community Order", "Order Supervisor Transfer", practitioner)
    ]
    await verifyContacts(page, crn, contacts)

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

    const contacts = [
        contact("Person", "Offender Manager Transfer", practitioner),
        contact("Person", "Responsible Officer Change", practitioner),
        contact("2 - ORA Community Order", "Order Supervisor Transfer", practitioner)
    ]
    await verifyContacts(page, crn, contacts)

})

test("Allocate previously managed offender with community event and requirement", async ({page}) => {
    const crn = await createOffender(page, {providerName: npsWales})
    await createEventForCRN(page, {
        crn,
        providerName: npsWales,
        teamName: wrexhamTeam,
        appearanceType: "Sentence",
        outcome: "ORA Community Order",
        length: "6"
    })

    await internalTransfer(page, {crn,staffName:"Rees, Mark (NPS - PO)", providerName: npsWales,teamName: wrexhamTeam,reason: "Initial Allocation"})
    await terminateEvent(page, crn, "1", "Completed - early good progress")

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

    const contacts = [
        contact("Person", "Offender Manager Transfer", practitioner),
        contact("Person", "Responsible Officer Change", practitioner),
        contact("2 - Curfew (Curfew) (6 Weeks)", "Sentence Component Transfer", practitioner),
        contact("2 - ORA Community Order", "Order Supervisor Transfer", practitioner)
    ]
    await verifyContacts(page, crn, contacts)

})


