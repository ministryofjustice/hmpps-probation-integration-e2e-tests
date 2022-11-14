import { expect, type Page } from '@playwright/test'

export const clickReferenceData = async (page: Page) => {

    await page.click("#linkNavigation1Home")
    await page.click("a[title='Select this option to access the Reference Data']")
    await expect(page.locator('#content > h1')).toHaveText('Reference Data')
}
