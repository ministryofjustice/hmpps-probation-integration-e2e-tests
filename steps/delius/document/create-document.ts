import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'

export async function createDocumentFromTemplate(page: Page, template: string = null) {
    await page.locator('input', { hasText: 'Document' }).click()
    await expect(page).toHaveTitle(/Document List/)
    await page.locator('[id="templateTypes\\:selectOneMenu"]').click()
    await selectOption(page, '[id="templateTypes\\:selectOneMenu"]', template)
    await page.locator('input', { hasText: 'Create from Template' }).click()
}
