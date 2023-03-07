import {expect, type Page} from '@playwright/test'

export const completeEquipmentSizesSection = async (page: Page) => {
    await page.getByLabel('Male', { exact: true }).check();
    await page.getByLabel('Large', { exact: true }).check();
    await page.getByRole('combobox', { name: 'Footwear' }).selectOption('9');
    await page.getByRole('group', {name: 'Mark equipment sizes section as complete?'}).getByLabel('Yes').check()
    await page.getByRole('button', {name: 'Save'}).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
