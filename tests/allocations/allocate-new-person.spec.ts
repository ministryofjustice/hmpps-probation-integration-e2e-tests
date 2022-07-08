import {test} from '@playwright/test'
import {login} from '../../steps/delius/login'
import {createOffender} from '../../steps/delius/offender/create-offender'
import {createEventForCRN} from '../../steps/delius/event/create-event'
import {createRequirementForEvent} from '../../steps/delius/requirement/create-requirement'
import {login as workforceLogin} from '../../steps/workforce/login'
import {allocateCase} from '../../steps/workforce/allocations'

test.beforeEach(async ({page}) => {
    await login(page)
})

test('Allocate new offender with event and requirement', async ({page}) => {
    const crn = await createOffender(page)
    await createEventForCRN(page, crn)
    await createRequirementForEvent(page, crn, '1')

    await workforceLogin(page)
    await allocateCase(page, crn)
})
