import { type Page } from '@playwright/test'

export const selectOffence = async (page: Page) => {
    await page.locator('[name="offenceId"]').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
}
