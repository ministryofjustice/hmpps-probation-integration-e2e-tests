import {Page} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {DeliusDateFormatter} from "./date-time";
import {findOffenderByName} from "./find-offender";

export async function createOffender(page: Page): Promise<string> {
    const firstname = faker.name.firstName()
    const surname = faker.name.lastName()
    await findOffenderByName(page, firstname,surname)
    await page.locator('input', {hasText: 'Add New Person'}).click()
    await page.fill('id=addOffenderForm:FirstName', firstname);
    await page.fill('id=addOffenderForm:Surname',surname);
    await page.selectOption('id=addOffenderForm:Sex', {label: 'Female'})
    await page.fill('id=DateOfBirth', DeliusDateFormatter(faker.date.birthdate({min: 18, max: 70, mode: 'age'})))
    await page.locator('input', {hasText: 'Save'}).click()
    await page.locator('main', {has: page.locator('h1', {hasText: 'Personal Details'})})
    return await page.locator('id=SearchForm:crn').textContent()
}
