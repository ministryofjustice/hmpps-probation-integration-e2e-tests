import { type Page } from '@playwright/test'

export const completeRoSHSection6 = async (page: Page): Promise<void> => {
    await page.locator('#textarea_FA61').fill('OPD Autotest')
    await page.locator('#textarea_FA67').fill('OPD Autotest')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
}
