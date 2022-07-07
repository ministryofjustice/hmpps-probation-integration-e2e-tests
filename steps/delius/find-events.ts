import {Page,expect} from '@playwright/test';
import {findOffenderByCRN} from "./find-offender";

export async function findFirstEventForOffender(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await page.click('id=linkNavigation2EventList');
    await expect(page).toHaveTitle(/Events/);
    await page.locator('tr', {hasText: '1'})
        .locator('a', {hasText: 'View'})
        .click();
}