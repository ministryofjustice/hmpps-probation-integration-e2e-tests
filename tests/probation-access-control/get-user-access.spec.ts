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

    // Check that the user with restriction added has access to the offender
    const response = await getAccessControlForUserAndPerson('NDELIUS01', crn)
    const responseBody = await response.json()
    expect(responseBody.userExcluded).toBe(false)
    expect(responseBody.userRestricted).toBe(false)

    // Check that a user with no restriction added has no access to the offender
    const response2 = await getAccessControlForUserAndPerson('AutomatedTestUser', crn)
    const responseBody2 = await response2.json()
    expect(responseBody2.userExcluded).toBe(false)
    expect(responseBody2.userRestricted).toBe(true)
})
