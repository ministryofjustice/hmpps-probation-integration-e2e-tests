import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAndBookPrisoner } from '../../steps/api/dps/prison-api'
import { deliusPerson } from '../../steps/delius/utils/person'

test('create a crn for Delius and DPS but not OASyS', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, { person })
    await createAndBookPrisoner(page, crn, person)
    console.log(crn, person)
})