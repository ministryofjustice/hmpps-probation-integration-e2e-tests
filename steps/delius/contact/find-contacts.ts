import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { doUntil } from '../utils/refresh.js'
import { Contact } from '../../../test-data/test-data.js'
import {format, parse} from "date-fns";
import {referralProgress} from "../../referandmonitor/referral.js";

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

export async function verifyContact(page: Page, contact: Contact) {
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
    const contactSearchButton = page.locator('input.btn-primary', { hasText: 'Context Search' })
    await doUntil(
        () => contactSearchButton.click(),
        () => expect(matchingContactRecord).not.toHaveCount(0)
    )

    await expect(matchingContactRecord).toContainText(contact.relatesTo)
    await expect(matchingContactRecord).toContainText(contact.type)
    if (contact.allocation) {
        await expect(matchingContactRecord).toContainText(
            `${contact.allocation.staff.lastName}, ${contact.allocation.staff.firstName}`
        )
    }
}

export const navigateToNSIContactDetails = async (page: Page, crn: string) => {
    await findOffenderByCRN(page, crn);
    await page.click('#linkNavigation2EventList');
    await expect(page).toHaveTitle(/Events/);
    await page.locator('[title="View event"]', {hasText: 'View'}).click();
    await expect(page).toHaveTitle(/Event Details/);
    await page.click('#linkNavigation3EventNsi');
    await expect(page).toHaveTitle(/Non Statutory Intervention List/);
    await page.locator('main[role="main"]').locator('a', {hasText: 'view'}).click();
    await expect(page).toHaveTitle(/Non Statutory Intervention Details/);
    await page.locator('[value="Contact List for this NSI"]').click();
    await expect(page).toHaveTitle(/Contact List for NSIs/);
}

export const verifyNSIContactInDelius = async (page: Page, relatesTo: string, appointmentDateTime: string, type: string, outcome: string,  attended?: string, complied?: string) => {
    try {
        await expect(page.locator('#ContactListForm\\:contactTable tbody tr:nth-child(2) td:nth-child(3) span')).toContainText(relatesTo);
        const parsedDate = parse(appointmentDateTime, 'hh:mmaaaa \'on\' dd MMM yyyy', new Date());
        const formattedDate = format(parsedDate, 'dd/MM/yyyy HH:mm');
        console.log(formattedDate);
        await expect(page.locator('#ContactListForm\\Table tbody tr:first-child td:nth-child(2)')).toContainText(formattedDate);
        await expect(page.locator('#ContactListForm\\Table tbody tr:first-child td:nth-child(1)')).toContainText(formattedDate);
        await expect(page.locator('#ContactListForm\\:contactTable tbody tr:nth-child(2) td:nth-child(5) span')).toContainText(type);
        await expect(page.locator('#ContactListForm\\:contactTable tbody tr:nth-child(2) td:nth-child(6) span')).toContainText(outcome);

        if (attended !== undefined) {
            await expect(page.locator('#ContactListForm\\:contactTable tbody tr:nth-child(2) td:nth-child(7) span')).toContainText(attended);
        }

        if (complied !== undefined) {
            await expect(page.locator('#ContactListForm\\:contactTable tbody tr:nth-child(2) td:nth-child(8) span')).toContainText(complied);
        }
    } catch (error) {
        console.error('Error occurred while parsing or formatting the date:', error);
    }
};


export const rescheduleSupplierAssessmentAppointment = async (page: Page, referralRef: string, newAppointmentDate: Date) => {
    await referralProgress(page, referralRef);
    await page.getByRole('link', {name: 'View details or reschedule'}).click();
    await expect(page.locator('.govuk-heading-xl')).toContainText('View appointment details');
    await page.getByRole('link', {name: 'Change appointment details'}).click();
    await expect(page.locator('.govuk-heading-xl')).toContainText('Change appointment details');
    await page.locator('input[name="date-day"]').fill(newAppointmentDate.getDate().toString());
    await page.locator('input[name="date-month"]').fill((newAppointmentDate.getMonth() + 1).toString());
    await page.locator('input[name="date-year"]').fill(newAppointmentDate.getFullYear().toString());
    await page.locator('text=Save and continue').click();
    await expect(page.locator('.govuk-heading-xl')).toContainText('Confirm appointment details');
    await page.locator('button:has-text("  Confirm  ")').click();
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/rescheduled-confirmation/);
    await expect(page.locator('#main-content h1')).toContainText('Supplier assessment appointment updated');
    await page.locator('text=Return to progress').click();
    await expect(page.locator('#supplier-assessment-status')).toContainText('scheduled');
    const rescheduledAppointmentDateTime = await page.locator('[data-cy="supplier-assessment-table"] .govuk-table__cell:first-child').innerText();
    return rescheduledAppointmentDateTime;
}
