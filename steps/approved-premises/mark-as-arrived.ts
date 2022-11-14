import { type Page, expect } from '@playwright/test'

export const verifyKeyworkerAvailability = async (page: Page, keyworker: string) => {
    // await page.locator('#keyWorkerStaffId').selectOption({ label: keyworker})



    await expect(page.getByLabel('Key Worker'), keyworker).toBeVisible()


    await page.getByLabel( 'Key Worker' ).selectOption({ label: keyworker})
    await expect(page.getByLabel( 'Key Worker')).toContainText(keyworker)
}
