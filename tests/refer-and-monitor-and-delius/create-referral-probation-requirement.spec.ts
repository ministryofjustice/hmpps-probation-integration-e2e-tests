import { test } from '@playwright/test'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { createAndApproveActionPlan, createAndAssignReferral, editSessionAttended } from './common'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { createEndOfServiceReport } from '../../steps/referandmonitor/end-of-service-report'
import { logout as logoutRandM } from '../../steps/referandmonitor/login'
import { login as loginDelius } from '../../steps/delius/login'
import { verifyContacts, navigateToNSIDetails } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create and complete referral for a case with a probation requirement', async ({ page }) => {
    const probationRequirementForCreation = {
        category: 'Probation Requirement',
        subCategory: '[Please Select]',
    }

    // Create a person with a SA2020 Community Order and a Probation Requirement in Delius
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
        event: {
            ...data.events.community,
            outcome: 'SA2020 Community Order',
        },
    })
    await createRequirementForEvent(page, {
        crn,
        team: data.teams.referAndMonitorTestTeam,
        requirement: probationRequirementForCreation,
    })

    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef)
    await createAndApproveActionPlan(page, referralRef)
    await editSessionAttended(page, referralRef)
    await createEndOfServiceReport(page)

    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Personal Wellbeing', 'NSI Commenced'),
        contact('1 - CRS Personal Wellbeing', 'NSI Referral'),
        contact('1 - CRS Personal Wellbeing', 'In Progress'),
        contact('1 - CRS Personal Wellbeing', 'Completed'),
        contact('1 - CRS Personal Wellbeing', 'Appointment with CRS Provider (NS)', null, 'Attended - Complied', 'Y', 'Y'),
        contact('1 - CRS Personal Wellbeing', 'Notification from CRS Provider'),
        contact('1 - CRS Personal Wellbeing', 'NSI Terminated'),
    ])

    await navigateToNSIDetails(page, crn, true)
})

