import { expect, type Page } from '@playwright/test'

export const completeAvailabilitySection = async (page: Page) => {
    await page.getByLabel('Available for work Monday morning').check()
    await page.getByLabel('Available for work Tuesday afternoon').check()
    await page.getByLabel('Available for work Wednesday afternoon').check()
    await page.getByLabel('Available for work Thursday morning').check()
    await page.getByLabel('Available for work Friday morning').check()
    await page.getByLabel('Available for work Saturday afternoon').check()
    await page.getByLabel('Available for work Sunday morning').check()
    await page.locator('#individual_availability_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Availability")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
