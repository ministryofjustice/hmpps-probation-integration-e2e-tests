import { expect, test } from '@playwright/test'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { prepareCaseForSentenceLogin } from '../../steps/court-case/prepare-case-for-sentence/login'
import {
    addCourtToUser,
    extractProbationRecordDetails,
    extractRegistrationDetails,
    formatDateToPrepareCase,
    searchAndClickDefendantAndGetHeader,
} from '../../steps/court-case/prepare-case-for-sentence/application'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { data } from '../../test-data/test-data'
import { createRegistration } from '../../steps/delius/registration/create-registration'
import { addCourtHearing } from '../../steps/api/court-case/court-case-api'
import { hearingData } from '../../steps/court-case/hearing-data'

test('Match Delius case with Court Case Hearing', async ({ page }) => {
    // Given a person with hearing in the Court Case Service
    const person = deliusPerson()
    await addCourtHearing(hearingData(person))
    console.log('Added court hearing for', person)

    // When I create the person's record in Delius
    await deliusLogin(page)
    const crn = await createOffender(page, { person })

    // And I create an event in nDelius
    const event = {
        ...data.events.custodial,
        mainOffence: 'Protection from Eviction Act 1977 - 08700',
        subOffence: '(Unlawful eviction - 08795)',
    }
    const createdEvent = await createCustodialEvent(page, { crn, event })

    // And I create the registration
    const createdRegistration = await createRegistration(page, crn, 'High RoSH')

    // Then the CRN is matched with the hearing and added to the court case service
    await prepareCaseForSentenceLogin(page)
    await addCourtToUser(page, "Sheffield Magistrates' Court")
    const prepareCaseHeader = await searchAndClickDefendantAndGetHeader(page, person.firstName, person.lastName, crn)
    await expect(prepareCaseHeader).toContainText(crn)
    await expect(prepareCaseHeader).toContainText(person.pnc)
    await expect(page.locator('.pac-probation-status')).toContainText('Current')

    // And I verify that "Probation record" details are same as Delius
    const { outcome: outcomeInPrepareCase, offence: offenceInPrepareCase } = await extractProbationRecordDetails(page)
    // expect(event.subOffence).toContain(offenceInPrepareCase)
    expect(offenceInPrepareCase).toContain(event.subOffence)
    expect(outcomeInPrepareCase).toContain(createdEvent.outcome)

    // And I verify that "Risk register" details are same as Delius
    await page.getByRole('link', { name: 'Risk register' }).click()
    await expect(page).toHaveTitle('Risk register - Prepare a case for sentence')
    const { registrationType, registeredDate, nextReviewDate } = await extractRegistrationDetails(page)
    expect(createdRegistration.deliusRegtype).toContain(registrationType)
    expect(await formatDateToPrepareCase(createdRegistration.deliusRegDate)).toContain(registeredDate)
    expect(await formatDateToPrepareCase(createdRegistration.deliusRegNextReviewDate)).toContain(nextReviewDate)
})
