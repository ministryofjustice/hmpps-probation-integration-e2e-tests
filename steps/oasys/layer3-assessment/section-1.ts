import { type Page, expect } from '@playwright/test'

export const completeRoSHSection1MarkAllNo = async (page: Page) => {
    await page.locator('[onclick*="P2_BT_NO"]', { hasText: 'Mark all as No' }).click()
    await page.locator('[onclick*="P3_BT_NO"]', { hasText: 'Mark all as No' }).click()
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R2 Risks to children - screening')
}
