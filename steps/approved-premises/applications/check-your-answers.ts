import { type Page, expect } from '@playwright/test'

export const checkYourAnswers = async (page: Page) => {
    await page.keyboard.down('End')
    await page.locator('button', { hasText: 'Continue' }).click();
    await expect(page.locator('#check-your-answers-status')).toHaveText("Completed")
}
