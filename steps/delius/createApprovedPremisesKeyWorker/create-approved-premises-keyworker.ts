// import {Page} from '@playwright/test'
import { type Page } from '@playwright/test'
import * as dotenv from 'dotenv'
import { clickReferenceData } from './create-staff-record/delius-home'
import { clickLocalReferenceRecords } from './create-staff-record/reference-data'
import { clickStaffButton } from './create-staff-record/local-reference-data'
import {
    ClickAddToAddProviderOfficer,
    clickUpdateButton,
    searchProviderOfficer,
} from './create-staff-record/provider-officer-list'
import { addProviderOfficerDetails } from './create-staff-record/add-provider-officer'
import { addProviderOfficersApprovedPremises } from './create-staff-record/update-provider-officer'
import { searchApprovedPremises } from './Keyworker/approved-premises-keyworker'
import { addKeyWorker } from './Keyworker/add-keyworker'

dotenv.config() // read environment variables into process.env

export const createApprovedPremisesKeyWorker = async (page: Page) => {
    // Given I am on the NDelius Home Page and click on "Reference Data" Button
    await clickReferenceData(page)
    // And I click on "Local Reference Records" link on the Reference Data page
    await clickLocalReferenceRecords(page)
    // When I click on "Staff" Button on the Local Reference Data page
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
    // Then I return the Name of the Key worker to be verified in Approved Premises
    return providerOfficer
}
