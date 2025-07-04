import { type Page, expect } from '@playwright/test'

export const enterCRN = async (page: Page, crn: string) => {
    await page.fill('#crn', crn)
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Approved Premises - Confirm/)
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
}
