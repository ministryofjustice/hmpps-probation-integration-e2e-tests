import { expect, type Page } from '@playwright/test'

const localReferenceRecordsLink = "a[title='Select to view locally maintained reference data']";

export const clickLocalReferenceRecords = async (page: Page) => {
    await page.click(localReferenceRecordsLink)
    await expect(page.locator('#content > h1')).toHaveText('Local Reference Data')
}
