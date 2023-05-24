import { Page, test } from '@playwright/test'

import { login as loginDelius } from '../../steps/delius/login.js'
import { logout as logoutDelius } from '../../steps/delius/logout.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { findNSIByCRN } from '../../steps/delius/event/find-nsi.js'
import {
    loginAsPractitioner as loginRandMAsPractitioner,
    loginAsSupplier as loginRandMAsSupplier,
    logout as logoutRandM,
} from '../../steps/referandmonitor/login.js'
import { assignReferral, makeReferral } from '../../steps/referandmonitor/referral.js'
import {
    addAppointmentFeedback,
    createSupplierAssessmentAppointment,
    editSessions,
} from '../../steps/referandmonitor/appointment.js'
import { data } from '../../test-data/test-data.js'
import { contact } from '../../steps/delius/utils/contact.js'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { approveActionPlan, createActionPlan } from '../../steps/referandmonitor/action-plan.js'
import { createEndOfServiceReport } from '../../steps/referandmonitor/end-of-service-report.js'
import { validateRarCount } from '../../steps/delius/requirement/find-requirement.js'
import { addMinutes } from 'date-fns'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a referral for a non-RAR requirement', async ({ page }) => {
    // Given a person in Delius
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })

    // And a non-RAR requirement
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // And a referral with a supplier assessment appointment and an attended session
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef)
    await createAndApproveActionPlan(page, referralRef)
    await editSessionAttended(page, referralRef)

    // When I complete the referral
    await createEndOfServiceReport(page)

    // Then the referral progress and appointment contacts appear in Delius
    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'Completed'),
        //check both appointment outcomes are present
        contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Attended - Complied', 'Y', 'Y'),
        //check there are now 3 Notification Contacts
        contact('1 - CRS Accommodation', 'Notification from CRS Provider'),
        contact('1 - CRS Accommodation', 'NSI Terminated'),
    ])
})

test('Create a referral for a RAR requirement', async ({ page }) => {
    // Given a person in Delius
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })

    // And a RAR requirement
    await createRequirementForEvent(page, {
        crn,
        team: data.teams.referAndMonitorTestTeam,
        requirement: data.requirements.rar,
    })

    // And a referral with a supplier assessment appointment and an attended session
    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef)
    await createAndApproveActionPlan(page, referralRef)
    await editSessionAttended(page, referralRef)

    // When I complete the referral
    await createEndOfServiceReport(page)

    // Then the referral progress and appointment contacts appear in Delius
    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'Completed'),
        //check both appointment outcomes are present
        contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Attended - Complied', 'Y', 'Y'),
        //check there are now 3 Notification Contacts
        contact('1 - CRS Accommodation', 'Notification from CRS Provider'),
        contact('1 - CRS Accommodation', 'NSI Terminated'),
    ])

    // And the RAR count is updated to 1
    await validateRarCount(page, crn, 1, data.requirements.rar, 1)
})

test('Create an appointment that was not attended', async ({ page }) => {
    // Given a person in Delius
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
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
    // Given a person in Delius
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
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

export const createAndAssignReferral = async (page: Page, crn: string) => {
    // As the Refer and Monitor probation practitioner
    // when I create a referral for the person in Refer and Monitor
    await loginRandMAsPractitioner(page)
    const referralRef: string = await makeReferral(page, crn)

    // Then an NSI is created in Delius
    await loginDelius(page)
    await findNSIByCRN(page, crn, 1, 'Commissioned Rehab Services')
    await logoutDelius(page)

    // As the Refer and Monitor supplier
    // When I create a SAA appointment in Refer and Monitor
    await logoutRandM(page)
    await loginRandMAsSupplier(page)

    // Assign the referral
    await assignReferral(page, referralRef)

    return referralRef
}

async function createAndApproveActionPlan(page: Page, referralRef: string) {
    await createActionPlan(page)
    await logoutRandM(page)

    await loginRandMAsPractitioner(page)
    await approveActionPlan(page, referralRef)
}

export const editSessionAttended = async (page: Page, referralRef: string) => {
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef, [{ number: 1, attended: true, notifyOm: false, date: new Date() }])
}

export const editSessionFailedToAttend = async (page: Page, referralRef: string) => {
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef, [{ number: 1, attended: false, notifyOm: true, date: new Date() }])
}
