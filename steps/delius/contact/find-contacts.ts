import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { doUntil } from '../utils/refresh.js'
import { Contact } from '../../../test-data/test-data.js'
import { referralProgress } from '../../referandmonitor/referral.js'

export async function findContactsByCRN(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await doUntil(
        () => page.click('#linkNavigation1ContactList'),
        () => expect(page).toHaveTitle(/Contact List/)
    )
}

export async function verifyContacts(page: Page, crn: string, contacts: Contact[]) {
    await findContactsByCRN(page, crn)
    for (const contact of contacts) {
        await verifyContact(page, contact)
    }
}

export async function verifyContact(page: Page, contact: Contact, isNSIContact = true) {
    let matchingContactRecord = page.locator('tr', { hasText: contact.type }).nth(contact.instance)

    if (contact.outcome) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.outcome })
    }

    if (contact.attended) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.attended })
    }

    if (contact.complied) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.complied })
    }

    if (contact.date) {
        matchingContactRecord = matchingContactRecord.filter({ hasText: contact.date.toString() })
    }

    await expect(matchingContactRecord).toContainText(contact.relatesTo)
    await expect(matchingContactRecord).toContainText(contact.type)

    if (contact.allocation) {
        await expect(matchingContactRecord).toContainText(
            `${contact.allocation.staff.lastName}, ${contact.allocation.staff.firstName}`
        )
    }

    if (!isNSIContact) {
        const contactSearchButton = page.locator('input.btn-primary', { hasText: 'Context Search' })
        await doUntil(
            () => contactSearchButton.click(),
            () => expect(matchingContactRecord).not.toHaveCount(0)
        )
    }
}
//
// export const navigateToNSIContactDetails = async (page: Page, crn: string) => {
//     await findOffenderByCRN(page, crn)
//     await page.click('#linkNavigation2EventList')
//     await expect(page).toHaveTitle(/Events/)
//     await page.locator('[title="View event"]', { hasText: 'View' }).click()
//     await expect(page).toHaveTitle(/Event Details/)
//     await page.click('#linkNavigation3EventNsi')
//     await expect(page).toHaveTitle(/Non Statutory Intervention List/)
//     await page.locator('main[role="main"]').locator('a', { hasText: 'view' }).click()
//     await expect(page).toHaveTitle(/Non Statutory Intervention Details/)
//     await page.locator('[value="Contact List for this NSI"]').click()
//     await expect(page).toHaveTitle(/Contact List for NSIs/)
// }


export const navigateToNSIContactDetails = async (page: Page, crn: string, terminatedEvent?: boolean) => {
    await findOffenderByCRN(page, crn);
    await page.click('#linkNavigation2EventList');
    await expect(page).toHaveTitle(/Events/);
    await page.locator('[title="View event"]', { hasText: 'View' }).click();
    await expect(page).toHaveTitle(/Event Details/);
    await page.click('#linkNavigation3EventNsi');

    if (terminatedEvent) {
        await page.locator('#nsiListForm\\:ShowTerminated').selectOption({ label: 'Yes' });
        await page.locator('#nsiListForm\\:nsiTable\\:tbody_element').getByRole('link', { name: 'view' }).click();
        await expect(page.locator('#content > h1')).toHaveText('Non Statutory Intervention Details');
    } else {
        await expect(page).toHaveTitle(/Non Statutory Intervention List/);
        await page.locator('main[role="main"]').locator('a', { hasText: 'view' }).click();
        await expect(page).toHaveTitle(/Non Statutory Intervention Details/);
        await page.locator('[value="Contact List for this NSI"]').click();
        await expect(page).toHaveTitle(/Contact List for NSIs/);
    }
};


export const rescheduleSupplierAssessmentAppointment = async (
    page: Page,
    referralRef: string,
    newAppointmentDate: Date,
    attended = true,
    notifyOm = false
) => {
    await referralProgress(page, referralRef)
    await page.getByRole('link', { name: 'View details or reschedule' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('View appointment details')
    await page.getByRole('link', { name: 'Change appointment details' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Change appointment details')
    await page.locator('input[name="date-day"]').fill(newAppointmentDate.getDate().toString())
    await page.locator('input[name="date-month"]').fill((newAppointmentDate.getMonth() + 1).toString())
    await page.locator('input[name="date-year"]').fill(newAppointmentDate.getFullYear().toString())
    await page.locator('text=Save and continue').click()
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/check-answers/)
    await page.click('.govuk-button')

    if (newAppointmentDate <= new Date()) {
        // add feedback
        await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/post-assessment-feedback\/edit/)
        await page.click(`input[value=${attended ? 'yes' : 'no'}]`)
        await page.click('button.govuk-button')

        if (attended) {
            await page.waitForURL(
                /service-provider\/referrals\/.*\/supplier-assessment\/post-assessment-feedback\/edit\/.*\/behaviour/
            )
            // add behaviour
            await page.fill('#behaviour-description', 'A description of the behaviour')
            // notify OM
            await page.click(`input[value=${notifyOm ? 'yes' : 'no'}]`)
            // save
            await page.click('button.govuk-button')
        }
        await page.waitForURL(
            /service-provider\/referrals\/.*\/supplier-assessment\/post-assessment-feedback\/edit\/.*\/check-your-answers/
        )

        // confirm feedback
        await page.click('button.govuk-button')
        await page.waitForURL(
            /service-provider\/referrals\/.*\/supplier-assessment\/post-assessment-feedback\/confirmation/
        )
    }

    // return to progress screen
    await page.click('a.govuk-button')
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/progress/)

    const rescheduledAppointmentDateTime = await page
        .locator('[data-cy="supplier-assessment-table"] .govuk-table__cell:first-child')
        .innerText()
    return rescheduledAppointmentDateTime
}

export const updateSAAppointmentLocation = async (
    page: Page,
    referralRef: string,
    appointmentMethod: string,
    NPSOfficeLocationToBeSelected: string,
    NPSLocationToBeVerifiedInRAndM: string
) => {
    await referralProgress(page, referralRef)
    await page.getByRole('link', { name: 'View details or reschedule' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('View appointment details')
    await page.getByRole('link', { name: 'Change appointment details' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Change appointment details')

    // Update the Appointment Location
    await page.getByLabel(appointmentMethod).check()
    await page.locator('#delius-office-location-code').selectOption({ label: NPSOfficeLocationToBeSelected })
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/check-answers/)
    await page.click('.govuk-button')
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/rescheduled-confirmation/)
    await page.locator('.govuk-button', { hasText: 'Return to progress' }).click()
    await page.getByRole('link', { name: 'View details or reschedule' }).click()

    // Verify the Updated Appointment Location
    const appointmentDL = await page.locator('.govuk-summary-list')
    await expect(await appointmentDL.locator('p').nth(4).textContent()).toContain(NPSLocationToBeVerifiedInRAndM)
}

export const verifySAApptmntLocationInDelius = async (
    page: Page,
    appointmentType: string,
    NPSOfficeLocationToBeVerified: string
) => {
    const matchingContactRecord = await page.locator('tr', { hasText: appointmentType })
    await matchingContactRecord.locator('[title="Link to view the contact details."]').click()

    // Verify the Updated Appointment Location in Delius
    const location = await page.locator('#searchContactForm\\:Location').textContent()
    await expect(location).toBe(NPSOfficeLocationToBeVerified)
}
