import {Page} from '@playwright/test';
import {findEventByCRN} from "../event/find-events";

export async function createRequirementForEvent(
    page: Page,
    crn: string,
    eventNumber: string,
    providerName: string = 'NPS Wales',
    teamName: string = 'NPS - Wrexham - Team 1',
) {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('id=linkNavigation3SentenceComponentREQ');
    await page.locator('main', {has: page.locator('h1', {hasText: 'Requirement Types'})})
    await page.locator('input', {hasText: 'Add'}).click();
    await page.selectOption('id=RequirementMainCategory', {label: 'Alcohol Treatment'})
    await page.selectOption('id=RequirementSubCategory', {label: 'Alcohol Treatment'})
    await page.selectOption('id=Area', {label: providerName})
    await page.selectOption('id=AddSentenceComponentsForm:requirement:Team', {label: teamName})
    await page.fill('id=Length', '6')
    await page.locator('input', {hasText: 'Add'}).click();
    await page.locator('input', {hasText: 'Save'}).click();
}