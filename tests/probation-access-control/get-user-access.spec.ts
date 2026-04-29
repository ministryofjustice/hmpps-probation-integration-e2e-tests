import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createRestrictions } from '../../steps/delius/restriction/create-restrictions'
import { getAccessControlForUserAndPerson } from '../../steps/api/probation-access-control/probation-access-control'

test('can get LAO access for a user', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()

    const crn: string = await createOffender(page, {
        person: person,
    })

    await createRestrictions(page, { crn, users: ['NDELIUS01'] })

    const response = await getAccessControlForUserAndPerson('NDELIUS01', crn)
    const responseBody = await response.json()

    expect(responseBody.userExcluded).toBe(false)
    expect(responseBody.userRestricted).toBe(true)
})
