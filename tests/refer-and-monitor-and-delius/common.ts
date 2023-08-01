import { Page } from '@playwright/test'
import {
    loginAsPractitioner as loginRandMAsPractitioner,
    loginAsSupplier as loginRandMAsSupplier,
    logout as logoutRandM,
} from '../../steps/referandmonitor/login'
import { login as loginDelius } from '../../steps/delius/login'
import { logout as logoutDelius } from '../../steps/delius/logout'
import { editSessions } from '../../steps/referandmonitor/appointment'
import { approveActionPlan, createActionPlan } from '../../steps/referandmonitor/action-plan'
import { assignReferral, makeReferral } from '../../steps/referandmonitor/referral'
import { findNSIByCRN } from '../../steps/delius/event/find-nsi'

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

export async function createAndApproveActionPlan(page: Page, referralRef: string) {
    await createActionPlan(page)
    await logoutRandM(page)

    await loginRandMAsPractitioner(page)
    await approveActionPlan(page, referralRef)
}

export async function editSessionAttended(page: Page, referralRef: string) {
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef, [{ number: 1, attended: true, notifyOm: false, date: new Date() }])
}

export async function editSessionFailedToAttend(page: Page, referralRef: string) {
    await logoutRandM(page)
    await loginRandMAsSupplier(page)
    await editSessions(page, referralRef, [{ number: 1, attended: false, notifyOm: true, date: new Date() }])
}
