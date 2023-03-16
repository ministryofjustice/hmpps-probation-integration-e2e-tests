import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { data } from '../../test-data/test-data.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as approvedPremisesLogin, navigateToApplications } from '../../steps/approved-premises/login.js'
import { selectApprovedPremises } from '../../steps/approved-premises/approved-premises-home.js'
import { managePlacement, selectCreatePlacementAction } from '../../steps/approved-premises/approved-premises.js'
import { searchOffenderWithCrn } from '../../steps/approved-premises/create-placement.js'
import { createBooking } from '../../steps/approved-premises/create-booking.js'
import { clickBackToDashboard } from '../../steps/approved-premises/placement-confirmation.js'
import { selectMarkAsArrivedAction } from '../../steps/approved-premises/placement-details.js'
import { verifyKeyworkerAvailability } from '../../steps/approved-premises/mark-as-arrived.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import { submitAPApplication } from '../../steps/approved-premises/applications/submit-application-full.js'
import {login as oasysLogin, UserType} from '../../steps/oasys/login.js'
import { createLayer3AssessmentWithoutNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs.js'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { contact } from '../../steps/delius/utils/contact.js'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender.js'

const nomisIds = []

test('Create an approved premises booking', async ({ page }) => {
    // test.slow() // increase the timeout - Delius/OASys/AP Applications/Approved premises can take a few minutes
    // Given I login in to NDelius
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    // And I create an offender
    const crn: string = await createOffender(page, { person, providerName: data.teams.allocationsTestTeam.provider })
    // And I create an event in nDelius
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // const crn = 'X642568'

    await oasysLogin(page, UserType.Booking)
    // And I create a Layer 3 Assessment without Needs in OASys
    await createLayer3AssessmentWithoutNeeds(page, crn)
    // And I login to Approved Premises
    await approvedPremisesLogin(page)
    // And I navigate to Approved Premises - Applications
    await navigateToApplications(page)
    // And I complete all the sections and submit the application for this CRN
    // await submitAPApplication(page, crn)
    // // And I log back to Approved Premises
    // await approvedPremisesLogin(page)
    // // And I choose a premises # Choose the first premises in the list
    // await selectApprovedPremises(page)
    // // And I navigate to create a placement # Choose Actions > Create a placement
    // await selectCreatePlacementAction(page)
    // // And I search for the offender with CRN
    // await searchOffenderWithCrn(page, crn)
    // // When I create a booking in Approved Premises
    // await createBooking(page)
    // // And I click on "Back to dashboard" link
    // await clickBackToDashboard(page)
    // // And I select to manage the placement
    // await managePlacement(page, crn)
    // // And I click on the Search button from the top menu
    // await selectMarkAsArrivedAction(page)
    // // Then I should see the staff member in the list of Key Workers
    // await verifyKeyworkerAvailability(
    //     page,
    //     `${data.staff.approvedPremisesKeyWorker.firstName} ${data.staff.approvedPremisesKeyWorker.lastName}`
    // )
    // // And login to nDelius
    // await deliusLogin(page)
    // // And I Search for offender with CRN
    // await findOffenderByCRN(page, crn)
    // // And I should see a contact in Delius for the booking
    // await verifyContacts(page, crn, [contact('Person', 'Approved Premises Booking for Bedford AP')])
})

// test.afterAll(async () => {
//     for (const nomsId of nomisIds) {
//         await releasePrisoner(nomsId)
//     }
// })
