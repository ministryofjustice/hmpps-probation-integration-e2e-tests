import { type Page, expect } from '@playwright/test'

export const clickSection2To4NextButton = async (page: Page) => {
    await page.keyboard.down('End')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845  h6')).toHaveText('R5 Other information - screening')
}
