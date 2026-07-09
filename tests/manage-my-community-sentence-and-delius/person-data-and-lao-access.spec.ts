import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { createRestrictions } from '../../steps/delius/restriction/create-restrictions'
import { data } from '../../test-data/test-data'
import {
    getPastAppointments,
    getPersonalDetails,
    getSentences,
} from '../../steps/api/manage-my-community-sentence/manage-my-community-sentence-api'

test('returns expected person details, sentences and past appointments for a standard case', async ({ page }) => {
    await deliusLogin(page)

    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    await createCommunityEvent(page, {
        crn,
        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })

    // Let Delius settle before next operation
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await createRequirementForEvent(page, {
        crn,
        team: data.teams.genericTeam,
    })

    // Test personal-details endpoint
    const personalDetailsResponse = await getPersonalDetails(crn)
    expect(personalDetailsResponse.status()).toBe(200)
    const personalDetails = await personalDetailsResponse.json()
    expect(personalDetails.name.forename).toBe(person.firstName)
    expect(personalDetails.name.surname).toBe(person.lastName)
    expect(personalDetails.dateOfBirth).toBeTruthy()

    // Test sentences endpoint
    const sentencesResponse = await getSentences(crn)
    expect(sentencesResponse.status()).toBe(200)
    const sentences = await sentencesResponse.json()
    expect(JSON.stringify(sentences)).toContain('SA2020 Community Order')
    expect(JSON.stringify(sentences)).toContain('Curfew')

    // Test past-appointments endpoint
    const pastAppointmentsResponse = await getPastAppointments(crn)
    expect(pastAppointmentsResponse.status()).toBe(200)
})

test('rejects an LAO case for personal details with 403', async ({ page }) => {
    await hmppsLogin(page)
    await deliusLogin(page)

    const crn = await createOffender(page, { person: deliusPerson() })

    await page.locator('a', { hasText: 'National search' }).click()
    await createRestrictions(page, { crn, users: ['NDELIUS01'] })

    const personalDetailsResponse = await getPersonalDetails(crn)
    expect(personalDetailsResponse.status()).toBe(403)
})