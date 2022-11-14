import {test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { data } from '../../test-data/test-data.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as approvedPremisesLogin } from '../../steps/approved-premises/login.js'
import {selectApprovedPremises} from "../../steps/approved-premises/approved-premises-home.js";
import {selectCreatePlacementAction} from "../../steps/approved-premises/approved-premises.js";
import {searchOffenderWithCrn} from "../../steps/approved-premises/create-placement.js";
import {createBooking} from "../../steps/approved-premises/create-booking.js";
import {clickBackToDashboard} from "../../steps/approved-premises/placement-confirmation.js";
import {selectMarkAsArrivedAction} from "../../steps/approved-premises/placement-details.js";
import {verifyKeyworkerAvailability} from "../../steps/approved-premises/mark-as-arrived.js";
import {createCustodialEvent, createEvent} from '../../steps/delius/event/create-event.js'
import {clickReferenceData} from "../../steps/delius/create-staff-record/delius-home.js";
import {clickLocalReferenceRecords} from "../../steps/delius/create-staff-record/reference-data.js";
import {clickStaffButton} from "../../steps/delius/create-staff-record/local-reference-data.js";
import {
    ClickAddToAddProviderOfficer, clickUpdateButton,
    searchProviderOfficer
} from "../../steps/delius/create-staff-record/provider-officer-list.js";
import {addProviderOfficerDetails} from "../../steps/delius/create-staff-record/add-provider-officer.js";
import {addProviderOfficersApprovedPremises} from "../../steps/delius/create-staff-record/update-provider-officer.js";
import {searchApprovedPremises} from "../../steps/delius/Keyworker/approved-premises-keyworker.js";
import {addKeyWorker} from "../../steps/delius/Keyworker/add-keyworker.js";
import {createAndBookPrisoner, releasePrisoner} from "../../steps/api/dps/prison-api.js";
import {setNomisId} from "../../steps/delius/offender/update-offender.js";

const nomisIds = []
test('Create a Staff record & linked keyworker record in NDelius and verify the keyworker is available in approved premises', async ({ page }) => {
    //Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    //And I create an offender
     const crn = await createOffender(page, { person })
    // And I create an event in nDelius
     await createCustodialEvent(page, {crn})
    //And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const nomisId = await createAndBookPrisoner(person)
    nomisIds.push(nomisId)
    //And I link the Nomis entry to the Delius entry
    await setNomisId(page, crn, nomisId)
    // await createAndBookPrisoner(person)
    // const nomisId = await createAndBookPrisoner(person)
    // const crn = "X371199"
    // When I click on Reference Data Button on the Home page
    await clickReferenceData(page)
    // And I click on "Local Reference Records" link on the Reference Data page
    await clickLocalReferenceRecords(page)
    // And I click on "Staff" Button on the Local Reference Data page
    await clickStaffButton(page)
    // And I click on "Add" Button to Add Provider Officer
    await ClickAddToAddProviderOfficer(page)
    // And I add Provider Officer details
    const providerOfficer = await addProviderOfficerDetails(page)
    // And I search for the Provider offer
    await searchProviderOfficer(page, providerOfficer)
    // And I click on Update Button to Update the Officer record
    await clickUpdateButton(page)
    // And I click on Update Button to Add the Officer's Approved Premises
    await addProviderOfficersApprovedPremises(page)
    // And I search for Approved Premises for linking the keyworker
    await searchApprovedPremises(page)
    // And I add/link the keyworker to the Approved premises
    await addKeyWorker(page, providerOfficer)

    // And I log in to Approved Premises as a "DELIUS_LOGIN_USER" user
    await approvedPremisesLogin(page)
    // And I choose a premises # Choose the first premises in the list
    await selectApprovedPremises(page)
    // And I navigate to create a placement # Choose Actions > Create a placement
    await selectCreatePlacementAction(page)
    //And I search for the offender with CRN
    await searchOffenderWithCrn(page, crn)
    // When I create a booking in Approved Premises
    await createBooking(page)
    // And I click on "Back to dashboard" link
    await clickBackToDashboard(page)
    // //And I click on the Search button from the top menu
    await selectMarkAsArrivedAction(page)
    // Then I should see the staff member in the list of Key Workers
    // await verifyKeyworkerAvailability(page, "Titus ZZ Cobio")
    await verifyKeyworkerAvailability(page, `${providerOfficer.firstName} ${providerOfficer.lastName}`)
})


test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
