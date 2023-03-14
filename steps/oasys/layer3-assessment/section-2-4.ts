import { type Page, expect } from '@playwright/test'

export const clickSection2To4NextButton = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Screening' }).click()
    // await page.locator('a', { hasText: 'Section 2 to 4' }).click()
    await page.locator('[href*="LAYER3_1_MENU,ROSHA2"]', { hasText: 'Section 2 to 4' }).click()


    // await page.getByLabel('Risk of suicide').click()
    await page.getByLabel('Risk of suicide').selectOption({ label: 'Yes' })

    // await page.getByLabel('Risk of suicide').locator('#itm_R3_1').selectOption('Yes')


    await page.getByLabel('Risk of self-harm').selectOption({ label: 'Yes' })
    await page.getByLabel('Coping in custody / hostel setting').selectOption({ label: 'Yes' })
    await page.getByLabel('Vulnerability').selectOption({ label: 'Yes' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 h6')).toHaveText('R5 Other information - screening')
}
