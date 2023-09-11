import { test } from '@playwright/test'

import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { logout as logoutRandM } from '../../steps/referandmonitor/login'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { data } from '../../test-data/test-data'
import { contact } from '../../steps/delius/utils/contact'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { createAndApproveActionPlan, createAndAssignReferral } from '../../tests/refer-and-monitor-and-delius/common'
import { addWeeks } from 'date-fns'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a referral for a pre-release - COM allocated', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCustodialEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
        date: addWeeks(new Date(), -23),
    })
    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam, staff: data.staff.referAndMonitorStaff },
    })

    const referralRef = await createAndAssignReferral(page, crn)
    await createSupplierAssessmentAppointment(page, referralRef)
    await createAndApproveActionPlan(page, referralRef)

    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'NSI Commenced'),
        contact('1 - CRS Accommodation', 'Appointment with CRS Staff (NS)', null, 'Attended - Complied', 'Y', 'Y'),
        contact('1 - CRS Accommodation', 'Notification from CRS Provider'),
    ])
})
