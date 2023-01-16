import { type Page, expect } from '@playwright/test'

export const selectNeedsAndSubmit = async (page: Page) => {
    await page.getByLabel('4. Education, training and employment').check()
    await page.getByLabel('6. Relationships').check()
    await page.getByLabel('9. Alcohol').check()
    await page.locator('button', { hasText: 'Submit' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Edit risk information')
}
