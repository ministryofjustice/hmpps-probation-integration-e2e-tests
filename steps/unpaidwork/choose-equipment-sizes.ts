import { expect, type Page } from '@playwright/test'

export const completeEquipmentSizesSection = async (page: Page) => {
    await page.getByLabel('Male', { exact: true }).check()
    await page.getByLabel('Large', { exact: true }).check()
    await page.getByRole('combobox', { name: 'Footwear' }).selectOption('9')
    await page.locator('#equipment_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Choose equipment sizes")').first()).toContainText('COMPLETED'.toLowerCase())
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
