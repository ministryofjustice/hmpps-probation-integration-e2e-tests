import { type Page, expect } from '@playwright/test'

export const confirmPlacementStartdate = async (page: Page) => {
    await page.getByLabel('Yes').check()
    // await page.locator('button', { hasText: 'Submit' }).click()
    // await page.locator('button', { hasText: 'Save and continue' }).click()
    await page.locator('.govuk-button').click();
    await expect(page.locator('#main-content h1')).toHaveText(
        'What is the purpose of the Approved Premises (AP) placement?'
    )
}
