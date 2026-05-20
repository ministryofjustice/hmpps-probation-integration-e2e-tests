import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { login as accreditedProgrammesLogin, manageAndDeliverLogin } from '../../steps/accredited-programmes/login'
import {
    addCaseToGroup,
    findCase,
    findProgrammeAndMakeReferral,
    updateReferralStatusToAwaitingAllocation,
    updateReferralStatusToComplete,
    updateReferralStatusToOnProgramme,
} from '../../steps/accredited-programmes/application'
import { slow } from '../../steps/common/common'
import { signAndlock } from '../../steps/oasys/layer3-assessment/sign-and-lock.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { data } from '../../test-data/test-data'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { faker } from '@faker-js/faker'
import { Yesterday } from '../../steps/delius/utils/date-time'

const nomisIds = []

test('Accredited Programmes termination', async ({ page }) => {
    slow()

    // Step 1: Create a new Offender & event in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName: data.teams.referAndMonitorTestTeam.provider })

    const offenceDate = faker.date.recent({ days: 1, refDate: Yesterday.toJSDate() })
    const event = await createCommunityEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
        date: offenceDate,
    })

    await createRequirementForEvent(page, {
        crn,
        requirement: data.requirements.accreditedProgramme,
        team: data.teams.referAndMonitorTestTeam,
    })

    // Step 2: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Step 3: Create a Layer 3 Assessment in OASys
    await oasysLogin(page, UserType.AccreditedProgrammesAssessment)
    await createLayer3CompleteAssessment(page, crn, person, 'Yes', nomisId, true)
    await signAndlock(page)

    // Step 4: Make referral in Accredited Programmes
    await accreditedProgrammesLogin(page)
    await findProgrammeAndMakeReferral(page, nomisId, 'Accredited Programme')
    await page.locator('a[data-qa="cdps-header-user"]').click()
    await page.getByText('Sign out').click()

    // Step 5: Update referral in Accredited Programmes Manage and Deliver
    await manageAndDeliverLogin(page)
    await findCase(page, person, crn)
    await updateReferralStatusToAwaitingAllocation(page, person, crn, event, offenceDate)
    await addCaseToGroup(page, person)

    // Update referral status to On programme
    await updateReferralStatusToOnProgramme(page, person, crn)

    // Update referral status to Completed
    await updateReferralStatusToComplete(page, person)
    await page.getByRole('link', { name: 'Sign out' }).click()

    // Log in to Delius to confirm the record has been updated correctly
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.getByRole('button', { name: 'Requirements' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await expect(page.locator('span:right-of(:text("Termination Reason"))')).toContainText('Requirement Completed')
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
