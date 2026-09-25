import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as jitbitLogin } from '../../steps/jitbit/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { searchForPerson } from '../../steps/jitbit/search-for-person'

test('Create person and check the record exists in Jitbit', async ({ page }) => {
    // Create a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person: person })
    await createCustodialEvent(page, { crn })

    // Login to Jitbit to check offender details exist
    await jitbitLogin(page)
    await searchForPerson(page, crn)

    const searchResult = page.locator('.crn-results-content')
    await expect(searchResult).toContainText(crn)
    await expect(searchResult).toContainText(person.firstName + ' ' + person.lastName)
    await page.getByRole('button', { name: 'Populate Selected' }).click()
})
