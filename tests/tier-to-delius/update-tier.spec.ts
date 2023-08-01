import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { createRegistration } from '../../steps/delius/registration/create-registration'

dotenv.config() // read environment variables into process.env

test('Create person and check tier is updated', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I create the registration
    await createRegistration(page, crn, 'High RoSH')

    // Then the tier is updated
    await page.locator('a', { hasText: 'Management Tier' }).click()
    await refreshUntil(page, () => expect(page.locator('table')).toContainText('B_0'))
    await expect(page.locator('#offender-overview').first()).toContainText('Tier:B_0')
})
