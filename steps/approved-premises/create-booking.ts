import { expect, type Page } from '@playwright/test'
import { splitDate } from '../common/common.js'
import { NextMonth, Tomorrow } from '../delius/utils/date-time.js'
import {login as approvedPremisesLogin, navigateToApplications} from "./login.js";
import {submitAPApplication} from "./applications/submit-application-full.js";
import {selectApprovedPremises} from "./approved-premises-home.js";
import {selectCreatePlacementAction} from "./approved-premises.js";
import {searchOffenderWithCrn} from "./create-placement.js";

const [arrivalDay, arrivalMonth, arrivalYear] = splitDate(Tomorrow)
const [departureDay, departureMonth, departureYear] = splitDate(NextMonth)

export const createBooking = async (page: Page) => {
    await page.fill('#arrivalDate-day', arrivalDay)
    await page.fill('#arrivalDate-month', arrivalMonth)
    await page.fill('#arrivalDate-year', arrivalYear)
    await page.fill('#departureDate-day', departureDay)
    await page.fill('#departureDate-month', departureMonth)
    await page.fill('#departureDate-year', departureYear)
    await page.locator('button', { hasText: 'Submit' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
}

export const createAPBooking = async (page: Page, crn: string) => {
    // And I login to Approved Premises
    await approvedPremisesLogin(page)
    // And I navigate to Approved Premises - Applications
    await navigateToApplications(page)
    // And I complete all the sections and submit the application for this CRN
    await submitAPApplication(page, crn)
    // And I log back to Approved Premises
    await approvedPremisesLogin(page)
    // And I choose a premises # Choose the first premises in the list
    await selectApprovedPremises(page)
    // And I navigate to create a placement # Choose Actions > Create a placement
    await selectCreatePlacementAction(page)
    // And I search for the offender with CRN
    await searchOffenderWithCrn(page, crn)
    // When I create a booking in Approved Premises
    await createBooking(page)
}
