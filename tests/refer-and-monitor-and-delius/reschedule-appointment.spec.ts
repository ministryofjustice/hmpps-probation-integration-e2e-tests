import {test} from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login.js'
import { logout as logoutDelius } from '../../steps/delius/logout.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { loginAsSupplier as loginRandMAsSupplier, logout as logoutRandM } from '../../steps/referandmonitor/login.js'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment.js'
import { data } from '../../test-data/test-data.js'
import {
    navigateToNSIContactDetails,
    rescheduleSupplierAssessmentAppointment, updateSAAppointmentLocation,
    verifyContact, verifySAApptmntLocationInDelius,
} from '../../steps/delius/contact/find-contacts.js'
import { addDays, subDays, subHours } from 'date-fns'
import { faker } from '@faker-js/faker'
import { formatRMDateToDelius, Tomorrow } from '../../steps/delius/utils/date-time.js'
import { createAndAssignReferral } from './common.js'

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
    const initialAppointmentDateTime = await createSupplierAssessmentAppointment(
        page,
        referralRef,
        addDays(new Date(), 2)
    )

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = formatRMDateToDelius(initialAppointmentDateTime)
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
    const newAppointmentDate = addDays(faker.date.soon({ days: 10, refDate: Tomorrow }), 1)
    const rescheduledAppointmentDateTime = await rescheduleSupplierAssessmentAppointment(
        page,
        referralRef,
        newAppointmentDate
    )

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedDateTime = formatRMDateToDelius(rescheduledAppointmentDateTime)
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
    const initialAppointmentDateTime = await createSupplierAssessmentAppointment(
        page,
        referralRef,
        addDays(new Date(), 2)
    )

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = formatRMDateToDelius(initialAppointmentDateTime)
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
    const rescheduledAppointmentDateTime = await rescheduleSupplierAssessmentAppointment(
        page,
        referralRef,
        pastAppointmentDate,
        true,
        false
    )

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedDateTime = formatRMDateToDelius(rescheduledAppointmentDateTime)
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
    test.slow()
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create an initial Supplier Assessment Appointment in R&M
    const referralRef = await createAndAssignReferral(page, crn)
    const initialAppointmentDateTime = await createSupplierAssessmentAppointment(
        page,
        referralRef,
        addDays(new Date(), 2)
    )

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = formatRMDateToDelius(initialAppointmentDateTime)

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
    const rescheduledAppointmentDateTime = await rescheduleSupplierAssessmentAppointment(
        page,
        referralRef,
        pastAppointmentDate,
        false
    )

    // Verify that both the Initial and Rescheduled Supplier Assessment Appointments are available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedDateTime = formatRMDateToDelius(rescheduledAppointmentDateTime)
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
    const initialAppointmentDateTime = await createSupplierAssessmentAppointment(
        page,
        referralRef,
        addDays(new Date(), 2)
    )
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    const formattedInitialDateTime = formatRMDateToDelius(initialAppointmentDateTime)
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
    const rescheduledAppointmentDateTime = await rescheduleSupplierAssessmentAppointment(
        page,
        referralRef,
        pastAppointmentDate,
        true,
        true
    )
    const formattedDateTime = formatRMDateToDelius(rescheduledAppointmentDateTime)

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
            outcome: 'Attended - Failed to Comply',
            attended: 'Y',
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
            attended: 'Y',
            complied: 'Y',
        },
        true
    )
})

test('Update Future Dated Supplier Assessment Appointment Location in Refer and Monitor and verify in Delius ', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // Create a Supplier Assessment Appointment in R&M with future date
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(
        page,
        referralRef,
        addDays(new Date(), 2)
    )

    // Update Supplier Assessment Appointment Location in Refer and Monitor
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    await updateSAAppointmentLocation(page,
        referralRef,
        'In-person meeting - NPS offices',
        'Alderdale: Progress House',
        'Alderdale: Progress House'
    ) ;

    // Verify that updated Supplier Assessment Appointment Location is available in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    await verifySAApptmntLocationInDelius(page,
        'Appointment with CRS Staff (NS)',
        'Workington - Progress House'
    );
})


