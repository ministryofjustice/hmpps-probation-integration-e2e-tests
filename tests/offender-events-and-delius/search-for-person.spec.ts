import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { doUntil } from '../../steps/delius/utils/refresh'
dotenv.config() // read environment variables into process.env

test('Create and search for a person', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I search for the person by name
    await page.locator('a', { hasText: 'New Search' }).click()
    const frame = await page.frameLocator('#elasticsearch-frame')
    await frame.locator('#search').fill(person.firstName + ' ' + person.lastName)

    // Then the CRN appears in the search results
    await doUntil(
        () => page.keyboard.press('Enter'),
        () => expect(frame.locator('.app-result-body')).toContainText(crn)
    )
})
