import {Page,expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {DeliusDateFormatter} from "./date-time";
import {findOffenderByCRN} from "./find-offender";
import {findEventByCRN} from "./find-events";

export async function createRequirementForEvent(page: Page, crn:string, eventNumber:string){
    await findEventByCRN(page, crn, eventNumber)
    await page.click('id=linkNavigation3SentenceComponentREQ');
    await page.locator('main', {has: page.locator('h1', {hasText: 'Requirement Types'})})
    await page.locator('input', {hasText: 'Add'}).click();
    await page.selectOption('id=RequirementMainCategory', {label: 'Alcohol Treatment'})
    await page.selectOption('id=RequirementSubCategory', {label: 'Alcohol Treatment'})
    await page.selectOption('id=Area', {label: 'NPS Wales'})
    await page.selectOption('id=AddSentenceComponentsForm:requirement:Team', {label: 'NPS - Wrexham - Team 1'})
    await page.fill('id=Length', '6')
    await page.locator('input', {hasText: 'Add'}).click();
    await page.locator('input', {hasText: 'Save'}).click();
}