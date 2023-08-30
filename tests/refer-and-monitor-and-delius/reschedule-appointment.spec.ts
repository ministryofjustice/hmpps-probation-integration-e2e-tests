import { expect, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { logout as logoutDelius } from '../../steps/delius/logout'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import {
    loginAsPractitioner,
    loginAsSupplier as loginRandMAsSupplier,
    logout as logoutRandM,
} from '../../steps/referandmonitor/login'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { data } from '../../test-data/test-data'
import {
    navigateToNSIContactDetails,
    navigateToNSIDetails,
    rescheduleSupplierAssessmentAppointment,
    updateSAAppointmentLocation,
    verifyContact,
    verifySAApptmntLocationInDelius,
} from '../../steps/delius/contact/find-contacts'
import { addDays, parse, subHours } from 'date-fns'
import { DeliusDateFormatter } from '../../steps/delius/utils/date-time'
import { createAndAssignReferral } from './common'
import { createContact } from '../../steps/delius/contact/create-contact'
import { deliusPerson } from '../../steps/delius/utils/person'
import { cancelReferral } from '../../steps/referandmonitor/referral'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Reschedule Supplier Assessment Appointment to future date', async ({ page }) => {
    test.slow()
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create an initial Supplier Assessment Appointment in R&M
    const referralRef = await createAndAssignReferral(page, crn)
    const initialAppointmentDateTime = addDays(new Date(), 2)
    await createSupplierAssessmentAppointment(page, referralRef, initialAppointmentDateTime)

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = DeliusDateFormatter(initialAppointmentDateTime)
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: '',
        },
        true
    )
    await logoutDelius(page)

    // Reschedule the Supplier Assessment Appointment in R&M
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    const newAppointmentDate = addDays(initialAppointmentDateTime, 1)
    await rescheduleSupplierAssessmentAppointment(page, referralRef, newAppointmentDate)

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedDateTime = DeliusDateFormatter(newAppointmentDate)
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: '',
            attended: '',
            complied: '',
        },
        true
    )
    await verifyContact(
        page,
        {
            instance: 1,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Rescheduled - Service Request',
            attended: 'N',
            complied: 'Y',
        },
        true
    )
})

test('Reschedule Supplier Assessment Appointment to past date/time with attendance set to Yes and notify practitioner set to No', async ({
    page,
}) => {
    test.slow()
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create an initial Supplier Assessment Appointment in R&M
    const referralRef = await createAndAssignReferral(page, crn)
    const initialAppointmentDateTime = addDays(new Date(), 2)
    await createSupplierAssessmentAppointment(page, referralRef, initialAppointmentDateTime)

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = DeliusDateFormatter(initialAppointmentDateTime)
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: '',
        },
        true
    )
    await logoutDelius(page)

    // Reschedule the Supplier Assessment Appointment in R&M
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    const pastAppointmentDate = subHours(new Date(), 1)
    await rescheduleSupplierAssessmentAppointment(page, referralRef, pastAppointmentDate, true)

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedDateTime = DeliusDateFormatter(pastAppointmentDate)
    await verifyContact(
        page,
        {
            instance: 1,
            relatesTo: '1 - CRS Accommodation',
            date: formattedDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Attended - Complied',
            attended: 'Y',
            complied: 'Y',
        },
        true
    )
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Rescheduled - Service Request',
            attended: 'N',
            complied: 'Y',
        },
        true
    )
})

test('Reschedule Supplier Assessment Appointment to past date/time with attendance set to No', async ({ page }) => {
    // test.slow()
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create an initial Supplier Assessment Appointment in R&M
    const referralRef = await createAndAssignReferral(page, crn)
    const initialAppointmentDateTime = addDays(new Date(), 2)
    await createSupplierAssessmentAppointment(page, referralRef, initialAppointmentDateTime)

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = DeliusDateFormatter(initialAppointmentDateTime)

    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: '',
        },
        true
    )
    await logoutDelius(page)

    // Reschedule the Supplier Assessment Appointment in R&M
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    const pastAppointmentDate = subHours(new Date(), 1)
    await rescheduleSupplierAssessmentAppointment(page, referralRef, pastAppointmentDate, false)

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedDateTime = DeliusDateFormatter(pastAppointmentDate)
    await verifyContact(
        page,
        {
            instance: 1,
            relatesTo: '1 - CRS Accommodation',
            date: formattedDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Failed to Attend',
            attended: 'N',
            complied: 'N',
        },
        true
    )
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Rescheduled - Service Request',
            attended: 'N',
            complied: 'Y',
        },
        true
    )
})

test('Reschedule Supplier Assessment Appointment to past date/time with attendance set to Yes and notify practitioner set to Yes', async ({
    page,
}) => {
    test.slow()
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create an initial Supplier Assessment Appointment in R&M
    const referralRef = await createAndAssignReferral(page, crn)
    const initialAppointmentDateTime = addDays(new Date(), 2)
    await createSupplierAssessmentAppointment(page, referralRef, initialAppointmentDateTime)
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = DeliusDateFormatter(initialAppointmentDateTime)
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
        },
        true
    )
    await logoutDelius(page)

    // Reschedule the Supplier Assessment Appointment in R&M
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    const pastAppointmentDate = subHours(new Date(), 1)
    await rescheduleSupplierAssessmentAppointment(page, referralRef, pastAppointmentDate, true)
    const formattedDateTime = DeliusDateFormatter(pastAppointmentDate)

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    await verifyContact(
        page,
        {
            instance: 1,
            relatesTo: '1 - CRS Accommodation',
            date: formattedDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Attended - Complied',
            attended: 'Y',
            complied: 'Y',
        },
        true
    )
    await verifyContact(
        page,
        {
            instance: 0,
            relatesTo: '1 - CRS Accommodation',
            date: formattedInitialDateTime,
            type: 'Appointment with CRS Staff (NS)',
            outcome: 'Rescheduled - Service Request',
            attended: 'N',
            complied: 'Y',
        },
        true
    )
})

test('Update Future Dated Supplier Assessment Appointment Location in Refer and Monitor and verify in Delius', async ({
    page,
}) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create a Supplier Assessment Appointment in R&M with future date
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef, addDays(new Date(), 2))

    // Update Supplier Assessment Appointment Location in Refer and Monitor
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    await updateSAAppointmentLocation(
        page,
        referralRef,
        'In-person meeting - NPS offices',
        'Alderdale: Progress House',
        'Alderdale: Progress House'
    )

    // Verify that updated Supplier Assessment Appointment Location is available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    await verifySAApptmntLocationInDelius(
        page,
        'Appointment with CRS Staff (NS)',
        'Workington - Progress House' //This corresponds to "Alderdale: Progress House" location in R&M
    )
})

test('Perform supplier assessment appointment scheduling with conflicting appointment in Delius', async ({ page }) => {
    test.slow()
    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create an Appointment in Delius with future date
    const appointmentDate = addDays(new Date(), 2)
    const startTime = parse('10:00', 'HH:mm', appointmentDate)
    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Other Appointment (Non NS)',
        relatesTo: 'Event 1 - ORA Community Order (6 Months)',
        date: appointmentDate,
        startTime: startTime,
        endTime: parse('10:30', 'HH:mm', appointmentDate),

        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })

    // Create a Supplier Assessment Appointment in R&M in the same date and time
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef, appointmentDate, startTime, true)

    // Verify the error message
    await expect(page.locator('.govuk-error-summary__body')).toHaveText(
        'The proposed date and time you selected clashes with another appointment. Please select a different date and time.'
    )
})

test('Verify Referral Cancellation by Probation Practitioner and its Reflection in Delius', async ({ page }) => {
    test.slow()

    // Create offender, community event, and requirement
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Generate a referral and assign it, then create a Supplier Assessment Appointment in R&M
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef, addDays(new Date(), 2))

    // Find the correct referral using the Referral Reference & Cancel the Referral
    await logoutRandM(page)
    await loginAsPractitioner(page)
    await cancelReferral(page, referralRef)

    // Verify the referral cancellation should reflect in Delius
    await loginDelius(page)
    await navigateToNSIDetails(page, crn, true)
    await expect(page.locator('div:right-of(:text("Outcome:"))').first()).toContainText('CRS Referral Cancelled')
})
