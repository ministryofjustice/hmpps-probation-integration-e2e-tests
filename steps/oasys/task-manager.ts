import {Page, expect} from '@playwright/test'

export const clickSearch = async (page: Page) => {
    await page.click('#main_menu_left_search > a')
    await expect(page.locator('#searchtop > h2')).toHaveText('Offender Search')
}
