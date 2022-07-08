import {Page} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {DeliusDateFormatter} from "../utils/date-time";
import {findOffenderByName} from "./find-offender";
import {randomPerson} from "../utils/person";

export async function createOffender(page: Page, providerName: string = 'NPS Wales'): Promise<string> {
    const person = randomPerson()
    await findOffenderByName(page, person.firstName, person.lastName)

    await page.locator('input', {hasText: 'Add New Person'}).click()
    await page.selectOption('id=addOffenderForm:Trust', {label: providerName})
    await page.fill('id=addOffenderForm:FirstName', person.firstName);
    await page.fill('id=addOffenderForm:Surname', person.lastName);
    await page.selectOption('id=addOffenderForm:Sex', {label: person.gender})
    await page.fill('id=DateOfBirth', DeliusDateFormatter(faker.date.birthdate({min: 18, max: 70, mode: 'age'})))
    await page.locator('input', {hasText: 'Save'}).click()
    if (await page.locator('.prompt-warning').count() > 0) {
        await page.locator('input', {hasText: 'Confirm'}).click()
    }
    await page.locator('main', {has: page.locator('h1', {hasText: 'Personal Details'})})
    return await page.locator('id=SearchForm:crn').textContent()
}
