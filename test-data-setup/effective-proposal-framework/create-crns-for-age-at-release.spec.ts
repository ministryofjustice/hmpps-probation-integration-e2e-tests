import {test} from "@playwright/test";
import {login as deliusLogin} from "../../steps/delius/login";
import {deliusPerson} from "../../steps/delius/utils/person";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {createCustodialEvent} from "../../steps/delius/event/create-event";
import {createRelease} from "../../steps/delius/release/create-release";

test('Create CRNs for age at release', async ({page}) => {
    await deliusLogin(page)

    const before = new Date("2023-07-29")
    const on = new Date("2023-07-30")
    const after = new Date("2023-07-31")
    for (const releaseDate of [before, on, after]) {
        const dateOfBirth = new Date("1982-07-30")
        const person = deliusPerson({dob: dateOfBirth, sex: null, firstName: null, lastName: null})
        const crn = await createOffender(page, {person})
        await createCustodialEvent(page, {crn, date: new Date("2022-07-31")})
        await createRelease(page, crn, 1, false, releaseDate)
    }
})