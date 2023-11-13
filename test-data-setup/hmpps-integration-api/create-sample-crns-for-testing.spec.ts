import { expect, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAndBookPrisoner } from '../../steps/api/dps/prison-api'
import { data } from '../../test-data/test-data'
import { deliusPerson } from "../../steps/delius/utils/person";


test('create a crn for Delius and DPS', async ({ page: Page })) => {
    await loginDelius(page)
    const person = deliusPerson({ sex: 'Male', dob: null, lastName: "Smith", firstName: "Bob" })
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.hmppsIntegrationApi.provider,
    })

    await createAndBookPrisoner(page, crn, person)
}
