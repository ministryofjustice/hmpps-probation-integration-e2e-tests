import { test } from '@playwright/test'

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
    rescheduleSupplierAssessmentAppointment,
    verifyNSIContactInDelius,
} from '../../steps/delius/contact/find-contacts.js'
import { addDays } from 'date-fns'
import { faker } from '@faker-js/faker'
import { Tomorrow } from '../../steps/delius/utils/date-time.js'
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
    console.log(initialAppointmentDateTime) // Output the appointment date and time

    // Verify the initial Supplier Assessment Appointment in Delius
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    await verifyNSIContactInDelius(
        page,
        '1 - CRS Accommodation',
        initialAppointmentDateTime,
        'Appointment with CRS Staff (NS)',
        ''
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
    /*Verify that the Delius system reflects the changes made in the Refer and Monitor system,
  including the updated appointment outcome, original attendance status, and the creation of a new appointment with the updated date and time.*/
    await loginDelius(page)
    await navigateToNSIContactDetails(page, crn)
    await verifyNSIContactInDelius(
        page,
        '1 - CRS Accommodation',
        rescheduledAppointmentDateTime,
        'Appointment with CRS Staff (NS)',
        ''
    )
    await verifyNSIContactInDelius(
        page,
        '1 - CRS Accommodation',
        initialAppointmentDateTime,
        'Appointment with CRS Staff (NS)',
        'Rescheduled - Service Request',
        'N',
        'Y'
    )
})
