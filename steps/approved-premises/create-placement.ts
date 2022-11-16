import {type Page, expect} from '@playwright/test'

export const searchOffenderWithCrn = async (page: Page, crn: string) => {
    await page.fill('#crn', crn)
    await page.click('button[name=\'search\']');
    await expect(page.locator('#main-content h1')).toHaveText('Create a placement')
}
