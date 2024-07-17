import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as pathfinderLogin } from '../../steps/pathfinder/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { DeliusDateFormatter } from '../../steps/delius/utils/date-time'
import { pathfinderDateFormatter, referToPathfinder } from '../../steps/pathfinder/refer-to-pathfinder'
import * as dotenv from 'dotenv'

dotenv.config()

test('Refer a community case to pathfinder', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    console.log(person.dob)

    // When I refer them in pathfinder
    await pathfinderLogin(page)
    await referToPathfinder(page, crn)

    // Then I can see their Delius details
    await page.getByRole('button', { name: 'View summary' }).click()
    await expect(page.locator('[data-qa=dob]')).toContainText(pathfinderDateFormatter(person.dob))
})
