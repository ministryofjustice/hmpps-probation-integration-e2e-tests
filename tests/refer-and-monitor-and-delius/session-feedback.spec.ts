import { test } from '@playwright/test'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { data } from '../../test-data/test-data.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { addAppointmentFeedback, createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment.js'
import { logout as logoutRandM } from '../../steps/referandmonitor/login.js'
import { login as loginDelius } from '../../steps/delius/login.js'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { contact } from '../../steps/delius/utils/contact.js'
import { createAndApproveActionPlan, createAndAssignReferral, editSessionFailedToAttend } from './common.js'
import { addMinutes } from 'date-fns'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create an appointment that was not attended', async ({ page }) => {
    // Given a person in Delius
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // And a referral with a supplier assessment appointment and action plan
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef)
    await createAndApproveActionPlan(page, referralRef)

    // When a session is failed to attend
    await editSessionFailedToAttend(page, referralRef)

    // Then the failure to attend and enforcement action appear in Delius
    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        //check both appointment outcomes are present
        contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Failed To Attend', 'N', 'N'),
        //check there are now 3 Notification Contacts
        contact('1 - CRS Accommodation', 'Notification from CRS Provider'),
        contact('1 - CRS Accommodation', 'Refer to Offender Manager'),
    ])
})

test('Add feedback to a scheduled appointment', async ({ page }) => {
    test.slow()
    // Given a person in Delius
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })
    // And a referral with a supplier assessment appointment in the future
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef, new Date(), addMinutes(new Date(), 1))

    // When I mark it as failed to attend
    await addAppointmentFeedback(page, false)

    // Then the failure to attend and enforcement action appear in Delius
    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'Appointment with CRS Staff (NS)', null, 'Failed To Attend', 'N', 'N'),
        contact('1 - CRS Accommodation', 'Review Enforcement Status'),
        contact('1 - CRS Accommodation', 'Refer to Offender Manager'),
    ])
})
