import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as sasLogin } from '../../steps/sas/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'

test('Create person and check SAS is updated', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await page.pause()

    // assign offender to user

    // Login to SAS to check offender details
    await sasLogin(page)
})
