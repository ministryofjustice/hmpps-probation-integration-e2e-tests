import { expect, type Page } from '@playwright/test'

export const searchApprovedPremises = async (page: Page) => {
    await page.locator('a', { hasText: 'Reference Data' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Reference Data')
    await page.locator('a', { hasText: 'Approved Premises and Key Workers' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Approved Premises Key Workers')
    await page.getByLabel('Approved Premises:').selectOption({ label: 'Bedford AP - Bedford' })
    await page.locator('input', { hasText: 'Search' }).click()
    await page.locator('input', { hasText: 'Add' }).click()
}
