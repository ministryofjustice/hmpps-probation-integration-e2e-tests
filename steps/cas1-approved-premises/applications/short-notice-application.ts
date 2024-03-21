import { type Page, expect } from '@playwright/test'

export const shortNoticeApplication = async (page: Page) => {
    await page.getByLabel('The risk level has recently escalated').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'What is the purpose of the Approved Premises (AP) placement?'
    )
}
