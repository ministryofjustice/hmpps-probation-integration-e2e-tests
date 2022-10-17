import { test } from '@playwright/test'

import { login as loginDelius } from '../../steps/delius/login'
import { logout as logoutDelius } from '../../steps/delius/logout'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { findNSIByCRN } from '../../steps/delius/event/find-nsi'
import {
    login as loginRandM,
    loginAsSupplier as loginRandMAsSupplier,
    logoutSupplier as logoutRandMSupplier,
} from '../../steps/referandmonitor/login'
import { assignReferral, makeReferral } from '../../steps/referandmonitor/referral'
import { createSupplierAssessmentAppointment } from '../../steps/referandmonitor/appointment'
import { data } from '../../test-data/test-data'
import { contact } from '../../steps/delius/utils/contact'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

const EVENT_NUMBER = 1

test('Create R&M Referral', async ({ page }) => {
    // Create a person to work with
    const crn: string = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.providerName })
    await createCommunityEvent(page, { crn, allocation: data.teams.referAndMonitorTestTeam })
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
    await loginRandMAsSupplier(page)

    // Assign the referral
    await assignReferral(page, referralRef)

    // Create a supplier assessment appointment (SAA) for the referral
    await createSupplierAssessmentAppointment(page, referralRef)
    await logoutRandMSupplier(page)

    // Check that the SAA has been created in Delius
    await loginDelius(page)
    await verifyContacts(page, crn, [contact('1 - Accommodation', 'CRS Assessment Appointment')])
})
