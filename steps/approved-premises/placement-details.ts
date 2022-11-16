import {type Page, expect} from '@playwright/test'

export const selectMarkAsArrivedAction = async (page: Page) => {
    const actionsButton = await page.waitForSelector('text=Actions');
    await actionsButton.click()
    const listButton = await page.waitForSelector('text=Mark as arrived');
    await listButton.click();
    await expect(page.locator('#main-content h1')).toHaveText('Mark the person as arrived')
}
