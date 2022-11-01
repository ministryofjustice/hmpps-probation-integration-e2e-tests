import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'

export async function createDocumentFromTemplate(page: Page, template: string) {
    await page.locator('input', { hasText: 'Document' }).click()
    await expect(page).toHaveTitle(/Document List/)
    await selectOption(page, '#documentListForm\\:templateTypes', template)
    await page.locator('input', { hasText: 'Create from Template' }).click()
}
