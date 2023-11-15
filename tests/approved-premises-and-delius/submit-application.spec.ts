import { test } from "@playwright/test"
import * as dotenv from 'dotenv'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3AssessmentWithoutNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { login as approvedPremisesLogin, navigateToApplications } from '../../steps/approved-premises/login'
import { submitAPApplication } from '../../steps/approved-premises/applications/submit-application-full'
import { reallocateApplication } from '../../steps/approved-premises/applications/reallocate'
import { assessApplication } from '../../steps/approved-premises/applications/assess-application'

dotenv.config() // read environment variables into process.env

const nomisIds = []

test('Create an approved premises application', async ({ page }) => {
    test.slow() // increase the timeout - Delius/OASys/AP Applications can take a few minutes
    // Given I login in to NDelius
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    // And I create an offender
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    // And I create an event in nDelius
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // And I login to OASys T2
    await oasysLogin(page, UserType.Booking)
    // And I create a Layer 3 Assessment without Needs
    await createLayer3AssessmentWithoutNeeds(page, crn)

    // When I login to Approved Premises
    await approvedPremisesLogin(page)
    // And I submit an application
    await navigateToApplications(page)
    await submitAPApplication(page, crn)

    // And I approve the application
    await reallocateApplication(page, `${person.firstName} ${person.lastName}`)
    await assessApplication(page, `${person.firstName} ${person.lastName}`)

    // And login to nDelius
    await deliusLogin(page)
    // And I Search for offender with CRN
    await findOffenderByCRN(page, crn)
    // Then I should see a contact in Delius for the approved application
    await verifyContacts(page, crn, [
        contact('1 - Adult Custody < 12m', 'Approved Premises Application Submitted'),
        contact('1 - Adult Custody < 12m', 'Approved Premises Application Accepted'),
    ])
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
