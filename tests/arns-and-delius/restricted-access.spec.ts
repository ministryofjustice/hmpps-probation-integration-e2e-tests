import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createRestrictions } from '../../steps/delius/restriction/create-restrictions.js'
import { getRisksFromArns } from '../../steps/api/arns/arns-api.js'

test('Verify ARNS endpoint returns 403 for restricted Delius case', async ({ page }) => {
    // Login to NDelius and create an offender
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, { person })

    // Set restriction as test user will no longer have access
    await page.locator('a', { hasText: 'National search' }).click()
    await expect(page).toHaveTitle(/National Search/)
    await createRestrictions(page, { crn, users: ['NDELIUS01'] })

    // Call the arns-api to verify access restriction
    const response = await getRisksFromArns(crn)
    const responseBody = await response.json()

    // Verify that arns-api returns 403 as the case has a restriction
    expect(response.status()).toEqual(403)
    expect(responseBody.developerMessage).toContain(`User does not have permission to access offender with CRN ${crn}`)
})
