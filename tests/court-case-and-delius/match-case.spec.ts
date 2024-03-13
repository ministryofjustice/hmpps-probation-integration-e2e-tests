import {expect, test} from '@playwright/test'
import { addCourtHearing } from '../../steps/court-case/add-court-hearing'
import {deliusPerson} from '../../steps/delius/utils/person'
import {login as deliusLogin} from "../../steps/delius/login.js";
import {createOffender} from "../../steps/delius/offender/create-offender.js";
import {prepareCaseForSentenceLogin} from "../../steps/court-case/prepare-case-for-sentence/login.js";
import {
    addCourtToUser,
    getCRNByNameFromCaseList
} from "../../steps/court-case/prepare-case-for-sentence/application.js";

test('Match Delius case with Court Case Hearing', async ({page}) => {
    // Given a person with hearing in the Court Case Service
    const person = deliusPerson()
    await addCourtHearing(person)
    console.log('Added court hearing for', person)

    // When I create the person's record in Delius
    await deliusLogin(page)
    const crn = await createOffender(page, { person })

    // Then the CRN is matched with the hearing and added to the court case service
    await prepareCaseForSentenceLogin(page)
    await addCourtToUser(page, 'Sheffield Magistrates\' Court')
    const hearingOutcomeCaseListCRN = await getCRNByNameFromCaseList(page, `${person.firstName} ${person.lastName}`);
    expect(hearingOutcomeCaseListCRN).toEqual(crn);
})
