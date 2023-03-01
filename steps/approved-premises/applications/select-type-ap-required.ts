import { type Page, expect } from '@playwright/test'

export const selectTypeOfAPRequired = async (page: Page) => {
    await page.getByLabel('Standard').check()
    await page.locator('button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Apply for an Approved Premises (AP) placement')
    await expect(page.locator('#type-of-ap-status')).toHaveText("Completed")
}
