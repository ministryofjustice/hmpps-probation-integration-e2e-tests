import {type Page, expect} from '@playwright/test'

export const completeRoSHSection1MarkAllNo = async (page: Page) => {
    await page.click('[onclick*="P2_BT_NO"]')
    await page.click('[onclick*="P3_BT_NO"]')
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R2 Risks to children - screening')
}
