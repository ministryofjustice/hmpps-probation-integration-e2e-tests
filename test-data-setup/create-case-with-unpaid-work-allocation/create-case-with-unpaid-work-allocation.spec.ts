import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { data } from '../../test-data/test-data'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { allocateCurrentCaseToUpwProject } from '../../steps/delius/upw/allocate-current-case-to-upw-project'

test('Create a case with an Unpaid Work Project Allocation', async ({ page }) => {
    test.slow()
    const person = deliusPerson()
    await loginDelius(page)

    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.unpaidWorkTestTeam.provider,
    })

    await createCommunityEvent(page, { crn, allocation: { team: data.teams.unpaidWorkTestTeam } })

    await createRequirementForEvent(page, {
        crn,
        requirement: data.requirements.unpaidWork,
        team: data.teams.unpaidWorkTestTeam,
    })

    await page.locator('a', { hasText: 'Personal Details' }).click()

    await allocateCurrentCaseToUpwProject(page, {
        providerName: data.teams.unpaidWorkTestTeam.provider,
        teamName: data.teams.unpaidWorkTestTeam.name,
    })
})
