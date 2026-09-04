import { type Page } from '@playwright/test'

export const completeReviewBasicSentencePlan = async (page: Page) => {
    await page.locator('#textarea_BSP_4').fill('OPD Autotest')
}
