import {type Page, expect} from '@playwright/test'

export const completeRoSHSection5FullAnalysisYes = async (page: Page) => {
    await page.locator('#itm_R5_1').selectOption({label: "Yes"})
    await page.fill('#textarea_R5_1_t', "TBA - Full analysis to be written in detail")
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R6 Risk of serious harm to others - full analysis')
}
