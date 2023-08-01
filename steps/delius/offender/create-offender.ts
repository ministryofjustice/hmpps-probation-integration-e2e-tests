import { type Page } from '@playwright/test'
import { findOffenderByName } from './find-offender'
import { deliusPerson, type Person } from '../utils/person'
import { fillDate, selectOption } from '../utils/inputs'

export async function createOffender(page: Page, args: { person?: Person; providerName?: string }): Promise<string> {
    const person = deliusPerson(args.person)
    await findOffenderByName(page, person.firstName, person.lastName)

    await page.locator('input', { hasText: 'Add New Person' }).click()
    await selectOption(page, '#addOffenderForm\\:Trust', args.providerName)
    await page.fill('#addOffenderForm\\:FirstName', person.firstName)
    await page.fill('#addOffenderForm\\:Surname', person.lastName)
    await selectOption(page, '#addOffenderForm\\:Sex', person.sex)
    await fillDate(page, '#DateOfBirth', person.dob)
    await page.locator('input', { hasText: 'Save' }).click()
    if ((await page.locator('.prompt-warning').count()) > 0) {
        await page.locator('input', { hasText: 'Confirm' }).click()
    }
    await page.locator('main', { has: page.locator('h1', { hasText: 'Personal Details' }) })
    return await page.locator('#SearchForm\\:crn').textContent()
}
