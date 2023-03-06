import { type Page, expect } from '@playwright/test'

export const attachReqrdDocuments = async (page: Page) => {
    await page.locator('.govuk-button',{ hasText: 'Save and continue' }).click()
    await expect(page.locator('#attach-required-documents-status')).toHaveText("Completed")
}
