import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { deliusPerson } from '../../steps/delius/utils/person'
import {buildAddress, createAddress} from "../../steps/delius/address/create-address";

test('create a crn for Delius and DPS but not OASyS', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const address = buildAddress()
    await createAddress(page, crn, address)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    console.log(crn, person)
    await releasePrisoner(nomisId)
})
