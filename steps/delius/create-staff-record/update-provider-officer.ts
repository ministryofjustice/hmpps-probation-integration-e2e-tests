import { expect, type Page } from '@playwright/test'

export const addProviderOfficersApprovedPremises = async (page: Page) => {

    await page.locator("#UpdateStaffForm\\:Team").selectOption({ label: 'Test Approved Premises Team' })
    await page.click("#UpdateStaffForm\\:j_id_id99")
    await page.click("#UpdateStaffForm\\:j_id_id131")
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')


}
