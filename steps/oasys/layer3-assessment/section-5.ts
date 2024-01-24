import { type Page, expect } from '@playwright/test'

export const completeRoSHSection5FullAnalysisYes = async (page: Page) => {
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText(
        'R6 Risk of serious harm to others - full analysis'
    )
}
