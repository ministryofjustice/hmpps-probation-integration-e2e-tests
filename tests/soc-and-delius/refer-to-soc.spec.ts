import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as socLogin } from '../../steps/soc/login'
import { referToSOC } from '../../steps/soc/refer-to-soc'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { DeliusDateFormatter } from '../../steps/delius/utils/date-time'
import * as dotenv from 'dotenv'

dotenv.config()

test('Add a community nominal to SOC', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I add them as a nominal to SOC
    await socLogin(page)
    await referToSOC(page, crn)

    // Then I can see their Delius details
    await page.getByRole('button', { name: 'View summary' }).click()
    await expect(page.locator('[data-qa=dob]')).toContainText(DeliusDateFormatter(person.dob))
})
