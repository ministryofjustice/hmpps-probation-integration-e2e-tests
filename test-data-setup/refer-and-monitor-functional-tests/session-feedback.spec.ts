import { test } from '@playwright/test'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { addAppointmentFeedback, createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { logout as logoutRandM } from '../../steps/referandmonitor/login'
import { login as loginDelius } from '../../steps/delius/login'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import {
    createAndApproveActionPlan,
    createAndAssignReferral,
    editSessionFailedToAttend,
} from '../../tests/refer-and-monitor-and-delius/common'
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
    await createSupplierAssessmentAppointment(page, referralRef, addMinutes(new Date(), 1))

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
