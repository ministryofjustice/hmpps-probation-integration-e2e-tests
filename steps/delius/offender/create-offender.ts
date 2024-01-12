import { type Page } from '@playwright/test'
import { findOffenderByName } from './find-offender'
import { deliusPerson, type Person } from '../utils/person'
import { fillDate, selectOption } from '../utils/inputs'
import { faker } from '@faker-js/faker'

export async function createOffender(page: Page, args: { person?: Person; providerName?: string }): Promise<string> {
    const person = deliusPerson(args.person)
    await findOffenderByName(page, person.firstName, person.lastName)

    await page.locator('input', { hasText: 'Add New Person' }).click()
    await selectOption(page, '#addOffenderForm\\:Trust', args.providerName)
    await page.fill('#addOffenderForm\\:FirstName', person.firstName)
    await page.fill('#addOffenderForm\\:Surname', person.lastName)
    await selectOption(page, '#addOffenderForm\\:Sex', 'Male')
    await fillDate(page, '#DateOfBirth', faker.date.birthdate({ min: 20, max: 30, mode: 'age' }))
    await selectOption(page, '#addOffenderForm\\:identifierType', 'PNC')
    await page.fill('#addOffenderForm\\:identifierValue', person.pnc)
    await page.locator('input', { hasText: 'Add/Update' }).click()
    await page.locator('input', { hasText: 'Save' }).click()
    if ((await page.locator('.prompt-warning').count()) > 0) {
        await page.locator('input', { hasText: 'Confirm' }).click()
    }
    await page.locator('main', { has: page.locator('h1', { hasText: 'Personal Details' }) })
    const crn = await page.locator('#SearchForm\\:crn').textContent()
    console.log('Person details:', person)
    console.log('CRN:', crn)
    return crn
}
