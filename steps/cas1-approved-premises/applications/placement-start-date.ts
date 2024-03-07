import { type Page, expect } from '@playwright/test'

export const confirmPlacementStartdate = async (page: Page) => {
    await page.getByLabel('Yes').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'What is the purpose of the Approved Premises (AP) placement?\n'
    )
}
