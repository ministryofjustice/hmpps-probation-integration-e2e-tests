import { test } from '@playwright/test'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createAndAssignReferral } from './common'
import { logout as logoutRandM } from '../../steps/referandmonitor/login'
import { login as loginDelius } from '../../steps/delius/login'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

<<<<<<< Updated upstream
test('Create a referral and nsi is created in delius', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
=======
// test('Create a referral for a non-RAR requirement', async ({ page }) => {
//     // Given a person in Delius
//     const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
//     await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
//
//     // And a non-RAR requirement
//     await createRequirementForEvent(page, { crn, team: data.teams.referAndMonitorTestTeam })
//
//     // And a referral with a supplier assessment appointment and an attended session
//     const referralRef = await createAndAssignReferral(page, crn)
//     await createSupplierAssessmentAppointment(page, referralRef)
//     await createAndApproveActionPlan(page, referralRef)
//     await editSessionAttended(page, referralRef)
//
//     // When I complete the referral
//     await createEndOfServiceReport(page)
//
//     // Then the referral progress and appointment contacts appear in Delius
//     await logoutRandM(page)
//     await loginDelius(page)
//     await verifyContacts(page, crn, [
//         contact('1 - CRS Accommodation', 'In Progress'),
//         contact('1 - CRS Accommodation', 'Completed'),
//         //check both appointment outcomes are present
//         contact('1 - CRS Accommodation', 'Appointment with CRS Provider (NS)', null, 'Attended - Complied', 'Y', 'Y'),
//         //check there are now 3 Notification Contacts
//         contact('1 - CRS Accommodation', 'Notification from CRS Provider'),
//         contact('1 - CRS Accommodation', 'NSI Terminated'),
//     ])
// })

test('Create a referral for a RAR requirement', async ({ page }) => {
    // Given a person in Delius
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
>>>>>>> Stashed changes
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })

    await createAndAssignReferral(page, crn)
    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'NSI Commenced'),
        contact('1 - CRS Accommodation', 'NSI Referral'),
    ])
})
