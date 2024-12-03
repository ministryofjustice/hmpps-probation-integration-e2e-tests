import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findEventByCRN } from '../event/find-events'

export const createLicenceCondition = async (page: Page, crn: string, eventNumber = 1): Promise<string> => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('link', { name: 'Licence Conditions' }).click()
    await expect(page.locator('h1')).toContainText('Licence Conditions')
    await page.getByRole('button', { name: 'Add Licence Conditions' }).click()
    await expect(page.locator('h1')).toContainText('Add Licence Conditions')
    await selectOption(page, `#LicenceMainCategory\\:selectOneMenu`)
    await selectOption(page, `#AreaLC\\:selectOneMenu`)
    const licenceSubCategory = `#licenceSubCategory\\:selectOneMenu`
    await page.locator(licenceSubCategory).isVisible()
    await selectOption(page, licenceSubCategory)
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('h1')).toContainText('Licence Conditions')
    return await page.locator('table tr:first-child td:nth-child(2)').textContent()
}

export const navigateToLicenceConditions = async (page: Page, crn: string, eventNumber = 1): Promise<void> => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('link', { name: 'Licence conditions' }).click()
}

export const deliusLicenceCondition = 'table tr:first-child td:nth-child(2)'
