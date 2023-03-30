import { test } from '@playwright/test'

import { login as loginDelius } from '../../steps/delius/login.js'
import { logout as logoutDelius } from '../../steps/delius/logout.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { findNSIByCRN } from '../../steps/delius/event/find-nsi.js'
import {
    login as loginRandM,
    loginAsSupplier as loginRandMAsSupplier,
    logoutSupplier as logoutRandMSupplier,
} from '../../steps/referandmonitor/login.js'
import { assignReferral, cancelReferral, makeReferral } from '../../steps/referandmonitor/referral.js'
import { createSupplierAssessmentAppointment, editSessions } from '../../steps/referandmonitor/appointment.js'
import { data } from '../../test-data/test-data.js'
import { contact } from '../../steps/delius/utils/contact.js'
import { verifyContacts } from '../../steps/delius/contact/find-contacts.js'
import { approveActionPlan, createActionPlan } from '../../steps/referandmonitor/action-plan.js'
import { createEndOfServiceReport } from '../../steps/referandmonitor/end-of-service-report.js'
import { validateRarCount } from '../../steps/delius/requirement/find-requirement.js'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

const EVENT_NUMBER = 1

test('Create R&M Referral - Not RAR', async ({ page }) => {
    // Create a person to work with
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // As the Refer and Monitor probation practioner
    // when I create a referral for the person in Refer and Monitor
    await loginRandM(page)
    const referralRef: string = await makeReferral(page, crn)

    // Then an NSI is created in Delius
    await loginDelius(page)
    await findNSIByCRN(page, crn, EVENT_NUMBER, 'Commissioned Rehab Services')
    await logoutDelius(page)

    // As the Refer and Monitor supplier
    // When I create a SAA appointment in Refer and Monitor
    await logoutRandMSupplier(page)
    await loginRandMAsSupplier(page)

    // Assign the referral
    await assignReferral(page, referralRef)

    // Create a supplier assessment appointment (SAA) for the referral and action plan
    await createSupplierAssessmentAppointment(page, referralRef)
    await createActionPlan(page)
    await logoutRandMSupplier(page)

    await loginRandM(page)
    await approveActionPlan(page, referralRef)

    await logoutRandMSupplier(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef)
    await createEndOfServiceReport(page)
    await logoutRandMSupplier(page)

    // Check that the Completed contact has been created in Delius
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'Completed'),
        //check both appointment outcomes are present
        contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Attended - Complied', 'Y', 'Y'),
        //check there are now 3 Notification Contacts
        contact('1 - CRS Accommodation', 'Notification from CRS Provider', null, null, null, null),
        contact('1 - CRS Accommodation', 'NSI Terminated'),
    ])
})

test('Create R&M Referral - RAR', async ({ page }) => {
    // Create a person to work with
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, {
        crn,
        team: data.teams.referAndMonitorTestTeam,
        requirement: data.requirements.rar,
    })

    // As the Refer and Monitor probation practioner
    // when I create a referral for the person in Refer and Monitor
    await loginRandM(page)
    const referralRef: string = await makeReferral(page, crn)

    // Then an NSI is created in Delius
    await loginDelius(page)
    await findNSIByCRN(page, crn, EVENT_NUMBER, 'Commissioned Rehab Services')
    await logoutDelius(page)

    // As the Refer and Monitor supplier
    // When I create a SAA appointment in Refer and Monitor
    await logoutRandMSupplier(page)
    await loginRandMAsSupplier(page)

    // Assign the referral
    await assignReferral(page, referralRef)

    // Create a supplier assessment appointment (SAA) for the referral and action plan
    await createSupplierAssessmentAppointment(page, referralRef)
    await createActionPlan(page)
    await logoutRandMSupplier(page)

    await loginRandM(page)
    await approveActionPlan(page, referralRef)

    await logoutRandMSupplier(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef)
    await createEndOfServiceReport(page)
    await logoutRandMSupplier(page)

    // Check that the Completed contact has been created in Delius
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'Completed'),
        //check both appointment outcomes are present
        contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Attended - Complied', 'Y', 'Y'),
        //check there are now 3 Notification Contacts
        contact('1 - CRS Accommodation', 'Notification from CRS Provider', null, null, null, null),
        contact('1 - CRS Accommodation', 'NSI Terminated'),
    ])
    await validateRarCount(
        page,
        crn,
        EVENT_NUMBER,
        'Rehabilitation Activity Requirement (RAR) - Rehabilitation Activity Requirement (RAR)',
        1
    )
})

test('Create R&M Referral - Notify OM', async ({ page }) => {
    // Create a person to work with
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })

    // As the Refer and Monitor probation practioner
    // when I create a referral for the person in Refer and Monitor
    await loginRandM(page)
    const referralRef: string = await makeReferral(page, crn)

    // Then an NSI is created in Delius
    await loginDelius(page)
    await findNSIByCRN(page, crn, EVENT_NUMBER, 'Commissioned Rehab Services')
    await logoutDelius(page)

    // As the Refer and Monitor supplier
    // When I create a SAA appointment in Refer and Monitor
    await logoutRandMSupplier(page)
    await loginRandMAsSupplier(page)

    // Assign the referral
    await assignReferral(page, referralRef)

    // Create a supplier assessment appointment (SAA) for the referral and action plan
    await createSupplierAssessmentAppointment(page, referralRef)
    await createActionPlan(page)
    await logoutRandMSupplier(page)

    await loginRandM(page)
    await approveActionPlan(page, referralRef)

    await logoutRandMSupplier(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef, [{ number: 1, attended: false, notifyOm: true }])
    await logoutRandMSupplier(page)

    // Check that the Completed contact has been created in Delius
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        //check both appointment outcomes are present
        contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Failed To Attend', 'N', 'N'),
        //check there are now 3 Notification Contacts
        contact('1 - CRS Accommodation', 'Notification from CRS Provider', null, null, null, null),
        contact('1 - CRS Accommodation', 'Refer to Offender Manager')
    ])
})
