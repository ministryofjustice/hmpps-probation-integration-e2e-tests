import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { signAndlock } from '../../steps/oasys/layer1-assessment/sign-and-lock'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { data } from '../../test-data/test-data'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as managePeopleOnProbationLogin } from '../../steps/manage-a-supervision/login'
import { searchPersonInMPoP } from '../../steps/manage-a-supervision/application'
import { createLayer1CompleteAssessment } from '../../steps/oasys/layer1-assessment/create-layer1-assessment/create-layer1-assessment'
import { DateTime } from 'luxon'
import { qa, slow } from '../../steps/common/common'

const nomisIds = []

test('Create a supervision package for a case that is not eligible for final third', async ({ page }) => {
    slow()

    // Step 1: Log in to Delius
    await deliusLogin(page)

    const person = deliusPerson({ sex: 'Male', dob: DateTime.now().minus({ years: 25 }).toJSDate() })

    // Step 2: Create a person/offender in Delius
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    // Step 3: Create a community event in Delius
    await createCommunityEvent(page, { crn })

    // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Step 5: Create a layer 1 assessment in OASys
    await oasysLogin(page, UserType.Booking)

    await createLayer1CompleteAssessment(page, crn, person, nomisId, true, true)
    await signAndlock(page)

    // When I login to Manage People on Probation
    await managePeopleOnProbationLogin(page)

    // And I search for the CRN
    await searchPersonInMPoP(page, crn)

    // Then the correct supervision package and tier is assigned
    await expect(page.locator(qa('crn'))).toContainText(crn)
    await expect(page.locator(qa('name'))).toContainText(`${person.firstName} ${person.lastName}`)
    await expect(page.locator('.supervision-package h3')).toContainText('Supervision package: community sentence')
    await expect(page.locator('.app-tier-header')).toContainText('Tier A')
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
