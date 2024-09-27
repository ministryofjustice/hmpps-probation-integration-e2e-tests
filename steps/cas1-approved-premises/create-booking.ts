import { expect, type Page } from '@playwright/test'
import { splitDate } from '../common/common'
import { NextMonth, Tomorrow } from '../delius/utils/date-time'
import { login as approvedPremisesLogin, navigateToApplications } from './login'
import { submitAPApplication } from './applications/submit-application-full'
import { selectApprovedPremises } from './approved-premises-home'
import { selectCreatePlacementAction } from './approved-premises'
import { searchOffenderWithCrn } from './create-placement'

const [arrivalDay, arrivalMonth, arrivalYear] = splitDate((Tomorrow))
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
    // Login to Approved Premises and navigate to Applications
    await approvedPremisesLogin(page)
    await navigateToApplications(page)

    // Complete all the sections and submit the application for this CRN
    await submitAPApplication(page, crn)

    // Choose a premises, create a placement, and search for the offender with CRN
    await selectApprovedPremises(page)
    await selectCreatePlacementAction(page)
    await searchOffenderWithCrn(page, crn)

    // Create a booking in Approved Premises
    await createBooking(page)

    // Log back in to Approved Premises
    await approvedPremisesLogin(page)
}
