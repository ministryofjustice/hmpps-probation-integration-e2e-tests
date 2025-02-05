import { type Page, expect } from '@playwright/test'

export const selectNeedsAndSubmit = async (page: Page) => {
    await page.getByLabel('6. Relationships').check()
    await page.getByLabel('3. Accommodation').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('RoSH summary')
}
