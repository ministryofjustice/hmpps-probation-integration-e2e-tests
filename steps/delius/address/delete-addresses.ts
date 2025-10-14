import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender'

export const deleteAddresses = async (page: Page, crn: string) => {
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await page.getByRole('link', { name: 'Addresses' }).click()
    await expect(page.locator('h1')).toContainText('Addresses and Accommodation')

    while ((await page.locator('#otherAddressTable tbody tr').count()) > 1) {
        await page
            .locator('#otherAddressTable tbody tr')
            .first()
            .locator('a[title="Link to Delete this Address"]')
            .click()
        await expect(page.locator('h1')).toContainText('Delete Address')
        await page.locator('input', { hasText: 'Confirm' }).click()
        await expect(page.locator('h1')).toContainText('Addresses and Accommodation')
    }
}
