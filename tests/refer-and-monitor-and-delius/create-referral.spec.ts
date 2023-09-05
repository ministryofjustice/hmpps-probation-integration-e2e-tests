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

test('Create a referral and nsi is created in delius', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.referAndMonitorTestTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })

    await createAndAssignReferral(page, crn)
    await logoutRandM(page)
    await loginDelius(page)
    await verifyContacts(page, crn, [
        contact('1 - CRS Accommodation', 'In Progress'),
        contact('1 - CRS Accommodation', 'NSI Commenced'),
        contact('1 - CRS Accommodation', 'NSI Referral')
    ])
})
