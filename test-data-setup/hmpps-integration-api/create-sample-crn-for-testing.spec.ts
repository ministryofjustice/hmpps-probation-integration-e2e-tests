import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { deliusPerson } from '../../steps/delius/utils/person'

test('create a crn for DPS and release them from Probation', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    console.log(crn, person, nomisId)
    await releasePrisoner(nomisId)
})
