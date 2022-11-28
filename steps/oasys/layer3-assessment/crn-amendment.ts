import {type Page, expect} from '@playwright/test'

export const clickOKForCRNAmendment = async (page: Page) => {
    await page.click('#B83726850038339573')
    await expect(page.locator('#contextleft > h3')).toHaveText('CMS Search Results')
}
