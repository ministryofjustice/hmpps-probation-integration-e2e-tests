import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent, createCustodialEvent } from '../../steps/delius/event/create-event'
import { logout as logoutRandM } from '../../steps/referandmonitor/login'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { data } from '../../test-data/test-data'
import { contact } from '../../steps/delius/utils/contact'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { createAndApproveActionPlan, createAndAssignReferral } from '../../tests/refer-and-monitor-and-delius/common'
import { DateTime } from 'luxon'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import {addDays,  addMonths } from "../../steps/delius/utils/date-time"

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a referral for a pre-release - COM allocated', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCustodialEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
        date: addDays(addMonths(DateTime.now(), -6), 8).toJSDate()
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

test('Create a referral for a community sentence - COM allocated', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
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

test('Create a referral for a pre-release - COM not allocated', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCustodialEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
        event: { ...data.events.custodial, length: '9' },
        date: addDays(addMonths(DateTime.now(), -9), 8).toJSDate(),
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

test('Create a referral for prisoner - COM not allocated', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCustodialEvent(page, {
        crn,
        allocation: { team: data.teams.referAndMonitorTestTeam },
        event: { ...data.events.custodial, ...{ outcome: 'CJA - Std Determinate Custody', length: '21' } },
        date: new Date(),
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
