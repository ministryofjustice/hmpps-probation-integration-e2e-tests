import { login as deliusLogin } from '../../steps/delius/login'
import { data } from '../../test-data/test-data'
import { Page, test } from '@playwright/test'
import { slow } from '../../steps/common/common'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { createInitialAppointment } from '../../steps/delius/contact/create-contact.js'

test.beforeEach(async ({ page }) => {
    await deliusLogin(page)
})

test('Create cases awaiting Allocation', async ({ page }) => {
    slow(10)
    await createCasesAwaitingAllocation(page, 50)
})

const createCasesAwaitingAllocation = async (page: Page, number: number) => {
    await deliusLogin(page)

    for (let i = 0; i < number; i++) {
        const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam.provider })

        await createCommunityEvent(page, {
            crn,
            allocation: {
                team: data.teams.allocationsTestTeam,
                staff: data.staff.unallocated,
            },
        })

        await createRequirementForEvent(page, { crn, team: data.teams.allocationsTestTeam })
        await createInitialAppointment(page, crn, '1', data.teams.allocationsTestTeam)
    }
}
