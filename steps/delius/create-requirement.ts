import {Page,expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {DeliusDateFormatter} from "./date-time";
import {findOffenderByCRN} from "./find-offender";
import {findFirstEventForOffender} from "./find-events";

export async function createRequirementForEvent(page: Page, crn:string){
    await findFirstEventForOffender(page, crn)
    await page.click('id=linkNavigation3SentenceComponentREQ');
    await page.locator('main', {has: page.locator('h1', {hasText: 'Requirement Types'})})
    await page.locator('input', {hasText: 'Add'}).click();
    await page.selectOption('id=RequirementMainCategory', {label: 'Alcohol Treatment'})
    await page.selectOption('id=RequirementSubCategory', {label: 'Alcohol Treatment'})
    await page.fill('id=Length', '6')
    await page.locator('input', {hasText: 'Add'}).click();
    await page.locator('input', {hasText: 'Save'}).click();
}