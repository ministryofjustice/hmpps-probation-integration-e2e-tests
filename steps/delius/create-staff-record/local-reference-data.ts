import { expect, type Page } from '@playwright/test'
const staffButton = "input[title='Select to access the list of provider staff']";

export const clickStaffButton = async (page: Page) => {
    await page.click(staffButton)
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')
}
