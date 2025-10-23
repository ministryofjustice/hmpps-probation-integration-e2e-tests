import { type Page } from '@playwright/test'

export const selectOffence = async (page: Page) => {
    await page.locator('[name="offenceId"]').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    if (await page.locator('.govuk-heading-l', { hasText: "We cannot check this person's tier" }).isVisible()) {
        await page.getByRole('radio', { name: 'High risk', exact: true }).check()
        await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    }
}
