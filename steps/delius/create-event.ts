import {Page,expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {DeliusDateFormatter} from "./date-time";
import {findOffenderByCRN} from "./find-offender";

export async function createSentenceEventForCRN(page: Page, crn:string){
    await findOffenderByCRN(page, crn)
    await page.click('id=linkNavigation2EventList');
    await expect(page).toHaveTitle(/Events/);
    await page.locator('input', {hasText: 'Add'}).click();
    const date = DeliusDateFormatter(faker.date.recent())
    await page.fill('id=ReferralDate', date)
    await page.fill('id=OffenceDate', date)
    await page.fill('id=ConvictionDate', date)
    await page.selectOption('id=MainOffence', {label: 'Arson - 05600'})
    await page.selectOption('id=Court', {label: 'Durham Crown Court'})
    await page.selectOption('id=AppearanceType', {label: 'Sentence'})
    await page.selectOption('id=Plea', {label: 'Guilty'})
    await page.selectOption('id=addEventForm:Outcome', {label: 'Adult Custody < 12m'})
    await page.fill('id=addEventForm:Length', '6')
    await page.locator('input', {hasText: 'Save'}).click();
    await expect(page).toHaveTitle(/Event Details/);
}