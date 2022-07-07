import {Page, expect} from '@playwright/test';
import {findOffenderByCRN} from "../offender/find-offender";

export async function findEventByCRN(page: Page, crn: string, eventNumber: string) {
    await findOffenderByCRN(page, crn)
    await page.click('id=linkNavigation2EventList');
    await expect(page).toHaveTitle(/Events/);
    await page.locator('tr', {hasText: eventNumber})
        .locator('a', {hasText: 'View'})
        .click();
}