import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { login as accreditedProgrammesLogin } from '../../steps/accredited-programmes/login'
import { login as accreditedProgrammesManageAndDeliverLogin } from '../../steps/accredited-programmes/manageAndDeliverLogin'
import {
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

const nomisIds = []

test('Accredited Programmes termination', async ({ page }) => {
    slow()

    // Step 1: Create a new Offender & event in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName: data.teams.referAndMonitorTestTeam.provider })

    await createCommunityEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
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
    await accreditedProgrammesManageAndDeliverLogin(page)
    await page.getByLabel('Primary navigation').getByRole('link', { name: 'Case list' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Case list')
    await page.locator('#crnOrPersonName').fill(crn)
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await page.pause()
    await page.locator('a', { hasText: `${person.firstName} ${person.lastName}` }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText(
        `Referral details: ${person.firstName} ${person.lastName}`
    )

    // Update referral status to On programme
    await updateReferralStatusToAwaitingAllocation(page, person)
    await updateReferralStatusToOnProgramme(page, person)

    // Update referral status to Completed
    await updateReferralStatusToComplete(page, person)
    await page.getByRole('link', { name: 'Sign out' }).click()

    // Log in to Delius to confirm the record has been updated correctly
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.pause()
    // await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Requirements' }).click()
    // await expect(page.locator('#appointmentsTable')).toContainText(/Attended - Complied/)

    // await findAccreditedProgrammeAndMakeReferral(page, nomisId)

    // Step 5: Verify OASys assessment data in Accredited Programmes service
    // await page.getByTestId('search-input').fill(nomisId)
    // await page.getByRole('button', { name: 'Search', exact: true }).click()
    // await clickOnOffenderLink(page, 'Date referred', `${person.lastName}, ${person.firstName}`)

    // await clickOnOffenderLink(page, 'Date referred', `Runte, Ginger`)
    // await expect(page).toHaveTitle(/Status history for referral to Becoming New Me Plus: general violence offence/)
    // await page.getByRole('link', { name: 'Risks and needs' }).click()
    // await verifyAssessmentDateTextToBe(page, `Assessment completed ${todaysDate}`)
    // await page.getByRole('link', { name: 'Risks and alerts' }).click()
    // await page.getByRole('link', { name: 'Section 2 - Offence analysis' }).click()
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
