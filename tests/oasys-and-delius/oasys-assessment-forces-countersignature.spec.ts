import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { createRegistration } from '../../steps/delius/registration/create-registration.js'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs.js'

dotenv.config() // read environment variables into process.env

const nomisIds = []

test('Verify that OASys assessments with Delius registration forces countersignature on a Medium assessment', async ({
    page,
}) => {
    test.slow()
    // Log in to NDelius and create an offender with a custodial event
    await deliusLogin(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCustodialEvent(page, {
        crn,
        allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff },
    })

    // Create a registration in NDelius and an entry in NOMIS
    await createRegistration(page, crn, 'Integrated Offender Management', 'West Midlands Region')
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Log in to OASys as a PSO and create a medium risk assessment
    await oasysLogin(page, UserType.ApprovedPSORole)
    await createLayer3CompleteAssessment(page, crn, person)
    await addLayer3AssessmentNeeds(page, 'ApprovedPSORole')

    // Verify that Delius registration forces countersignature on a Medium Risk assessment
    await expect(page.locator('.RegionStandard')).toContainText(
        'The assessment requires an additional countersignature'
    )
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
