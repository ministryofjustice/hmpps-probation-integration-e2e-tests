import { type Page } from '@playwright/test'
import { findOffenderByName } from './find-offender'
import { deliusPerson, type Person } from '../utils/person'
import { fillDate, selectOption } from '../utils/inputs'

export async function createOffender(page: Page, args: { person?: Person; providerName?: string }): Promise<string> {
    const person = deliusPerson(args.person)
    await findOffenderByName(page, person.firstName, person.lastName)

    await page.locator('input', { hasText: 'Add New Person' }).click()
    await selectOption(page, '#trust\\:selectOneMenu', args.providerName)
    await page.fill('#firstName\\:inputText', person.firstName)
    await page.fill('#surname\\:inputText', person.lastName)
    await selectOption(page, '#sex\\:selectOneMenu', person.sex)
    await fillDate(page, '#dateOfBirth\\:datePicker', person.dob)
    await selectOption(page, '#identifierType\\:selectOneMenu', 'PNC')
    await page.fill('#identifierValue\\:inputText', person.pnc)
    await page.locator('input', { hasText: 'Add/Update' }).click()
    await page.locator('input', { hasText: 'Save' }).click()
    if ((await page.locator('.prompt-warning').count()) > 0) {
        await page.locator('input', { hasText: 'Confirm' }).click()
    }
    await page.locator('main', { has: page.locator('h1', { hasText: 'Personal Details' }) })
    const crn = await page.locator('#crn\\:outputText').textContent()
    console.log('Person details:', person)
    console.log('CRN:', crn)
    return crn
}
