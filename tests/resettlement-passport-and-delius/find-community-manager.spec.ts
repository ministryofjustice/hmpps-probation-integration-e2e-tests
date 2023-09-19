import {expect, test} from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import {getCommunityManager} from "../../steps/api/resettlement-passport/resettlement-passport-api";

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Community Manager Details are returned', async ({ page }) => {
    const crn = await createOffender(page, { providerName: data.teams.genericTeam.provider })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.genericTeam } })
    await internalTransfer(page, { crn, allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff } })

    const com = await getCommunityManager(crn)
    expect(com.name.forename).toBe(data.staff.genericStaff.firstName)
    expect(com.name.surname).toBe(data.staff.genericStaff.lastName)
    expect(com.unallocated).toBeFalsy()
})
