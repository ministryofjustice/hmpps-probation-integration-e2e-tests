import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import {login as manageASupervisionLogin} from "../../steps/manage-a-supervision/login.js";

dotenv.config() // read environment variables into process.env

test('Search for a person in Manage a Supervision', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I login to Manage A Workforce
    await manageASupervisionLogin(page)

    // And I search for the CRN
    await page.getByRole('button', { name: 'Start now' }).click()
    await expect(page).toHaveTitle('Manage a Supervision - Search')
    await page.getByLabel('Find a person on probation').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()

    // Then the person appears in the search results and crn & name matches
    await page.locator(`[href$="${crn}"]`).click()
    await expect(page).toHaveTitle('Manage a Supervision - Overview')
    await expect(page.locator('[data-qa="crn"]')).toContainText(crn)
    await expect(page.locator('[data-qa="name"]')).toContainText(person.firstName+ ' ' +  person.lastName )
})
