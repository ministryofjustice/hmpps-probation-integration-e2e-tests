import { type Page, expect } from '@playwright/test'

export const applicationOutsideNSTimescales = async (page: Page) => {
    await page.getByLabel('The sentence is shorter than 12 months').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('What is the purpose of the Approved Premises (AP) placement?')
}
