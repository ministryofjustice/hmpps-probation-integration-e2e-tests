import { type Page } from '@playwright/test'

export const completeReviewBasicSentencePlan = async (page: Page) => {
    await page.locator('#textarea_BSP_4').fill('OPD Autotest')
    // await page.getByRole('link', { name: 'Basic Sentence Plan' }).click()
    // await page.locator('[href$="LAYER3_1_MENU,ISP3\')"]').isVisible()
    // await page.getByRole('link', { name: 'Section 5.2 to 8' }).click()
    // await page.getByLabel('Do you agree with the proposed plan (if no, explain why below)').selectOption('IP.17~YES')
}
