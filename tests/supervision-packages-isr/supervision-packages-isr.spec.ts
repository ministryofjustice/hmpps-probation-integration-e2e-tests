import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import {
    createLayer3AssessmentWithoutNeeds,
    createLayer3CompleteAssessment,
} from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { signAndlock } from '../../steps/oasys/layer3-assessment/sign-and-lock'
import { registerCaseInMPoP } from '../../steps/manage-a-supervision/check-in'
import { login as managePeopleOnProbationLogin } from '../../steps/manage-a-supervision/login'

import { slow } from '../../steps/common/common'
import { createCommunityEvent, createCustodialEvent } from '../../steps/delius/event/create-event'
import { data } from '../../test-data/test-data'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { searchPersonInMPoP } from '../../steps/manage-a-supervision/application'

const person = deliusPerson()
let crn: string
const nomisIds = []

// test('Create a NSD case with a custodial event not eligible for final third', async ({ page }) => {
//     slow()
//
//     // Step 1: Log in to Delius
//     await deliusLogin(page)
//
//     // Step 2: Create a person/offender in Delius
//     crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
//
//     // Step 3: Create a custodial event in Delius
//     await createCustodialEvent(page, { crn })
//     await internalTransfer(page, {
//         crn,
//         allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
//         reason: 'Case Allocated to NPS',
//     })
//
//     // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
//     const { nomisId } = await createAndBookPrisoner(page, crn, person)
//     nomisIds.push(nomisId)
//
//     // Create an assessment in OASys
//     await oasysLogin(page, UserType.Booking)
//
//     // await createLayer3CompleteAssessment(page, crn, person, 'Yes')
//     await createLayer3CompleteAssessment(page, crn, person, 'Yes', nomisId, true)
//     await signAndlock(page)
//
//     // When the e-supervision case is registered in MPoP
//     // const uuid = await registerCaseInMPoP(page, person, crn)
//
//     // When I login to Manage People on Probation
//     await managePeopleOnProbationLogin(page)
//
//     // And I search for the CRN
//     await searchPersonInMPoP(page, crn)
//     await page.pause()
//
//     // Then the correct supervision package is assigned
//     await expect(page.locator('h2.govuk-heading-m')).toContainText('Supervision package')
//     // await expect(page.locator('.app-tier-header h3.govuk-heading-s')).toContainText('Tier')
// })

test('Create a NSD case with a community event not eligible for final third', async ({ page }) => {
    slow()

    // Step 1: Log in to Delius
    await deliusLogin(page)

    // Step 2: Create a person/offender in Delius
    crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    // Step 3: Create a custodial event in Delius
    await createCommunityEvent(page, { crn })
    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
        reason: 'Case Allocated to NPS',
    })

    // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Create an assessment in OASys
    await oasysLogin(page, UserType.Booking)

    await createLayer3CompleteAssessment(page, crn, person, 'Yes', nomisId, true)
    await signAndlock(page)

    // When I login to Manage People on Probation
    await managePeopleOnProbationLogin(page)

    // And I search for the CRN
    await searchPersonInMPoP(page, crn)
    await page.pause()

    // Then the correct supervision package is assigned
    await expect(page.locator('h2.govuk-heading-m')).toContainText('Supervision package')
    // await expect(page.locator('.app-tier-header h3.govuk-heading-s')).toContainText('Tier')
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
