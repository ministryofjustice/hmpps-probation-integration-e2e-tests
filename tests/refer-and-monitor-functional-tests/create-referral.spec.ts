import { test } from '@playwright/test'

import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { logout as logoutRandM } from '../../steps/referandmonitor/login'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { data } from '../../test-data/test-data'
import { contact } from '../../steps/delius/utils/contact'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { createEndOfServiceReport } from '../../steps/referandmonitor/end-of-service-report'
import { validateRarCount } from '../../steps/delius/requirement/find-requirement'
import {
    createAndApproveActionPlan,
    createAndAssignReferral,
    editSessionAttended,
} from '../refer-and-monitor-and-delius/common'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a referral for a non-RAR requirement', async ({ page }) => {
    // Given a person in Delius
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
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
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
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
