import { test } from '@playwright/test'
import { addCourtHearing } from '../../steps/court-case/add-court-hearing'
import {deliusPerson, Person} from '../../steps/delius/utils/person'
import {login as deliusLogin} from "../../steps/delius/login.js";
import {createOffender} from "../../steps/delius/offender/create-offender.js";
import {createCustodialEvent} from "../../steps/delius/event/create-event.js";
import {createAndBookPrisoner} from "../../steps/api/dps/prison-api.js";
import {parseISO} from "date-fns";

test('Match Delius case with Court Case Hearing', async ({page}) => {
    // Given a person with hearing in the Court Case Service
    const person = deliusPerson()
    await addCourtHearing(person)
    console.log('Added court hearing for', person)

    // const person = {"firstName":"Fernando","lastName":"Donnelly","sex":"Male","dob":parseISO("1994-11-20T15:08:33.356Z"),"pnc":"1994/0587756V"} as Person
    const person = {"firstName":"Margie","lastName":"Buckridge","sex":"Female","dob":parseISO("1977-07-05T02:42:47.259Z"),"pnc": null}
    // When I create the person's record in Delius
    await deliusLogin(page)
    const crn = await createOffender(page, { person })


    // ...
    // Then the CRN is matched with the hearing and added to the court case service
    // ...
})
