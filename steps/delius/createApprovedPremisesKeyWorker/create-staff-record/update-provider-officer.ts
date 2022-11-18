import { expect, type Page } from '@playwright/test'

export const addProviderOfficersApprovedPremises = async (page: Page) => {
    await page.locator("[title='[Please Select]']").selectOption({ label: 'Test Approved Premises Team' })
    await page.locator('input', { hasText: 'Add' }).click()
    await page.locator('input', { hasText: 'Save' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')
}
