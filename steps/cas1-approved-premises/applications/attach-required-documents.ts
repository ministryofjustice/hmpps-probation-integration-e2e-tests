import { type Page, expect } from '@playwright/test'

export const attachReqrdDocuments = async (page: Page) => {
    await page
        .locator('#otherDocumentDetails')
        .fill('Details of the relevant documents that to let the assessor to know')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#attach-required-documents-status')).toHaveText('Completed')
}
