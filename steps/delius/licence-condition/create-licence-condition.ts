import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findEventByCRN } from '../event/find-events.js'

export const createLicenceCondition = async (page: Page, crn: string, eventNumber = 1) => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('link', { name: 'Licence Conditions' }).click()
    await expect(page.locator('h1')).toHaveText('Licence Conditions')
    await page.getByRole('button', { name: 'Add Licence Conditions' }).click()
    await expect(page.locator('h1')).toHaveText('Add Licence Conditions')
    await selectOption(page, `#LicenceMainCategory`)
    await selectOption(page, `#LicenceSubCategory`)
    await selectOption(page, `#AreaLC`)
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('h1')).toHaveText('Licence Conditions')
}