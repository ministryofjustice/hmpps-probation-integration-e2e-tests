import { Page } from '@playwright/test'

export const createEndOfServiceReport = async (page: Page) => {
    await page.locator('button', { hasText: 'Create end of service report' }).click()
    await page.waitForURL(/service-provider\/end-of-service-report\/.*\/outcomes\/.*/)

    await page.click('input[value="ACHIEVED"]')
    await page.click('button.govuk-button')
    await page.waitForURL(/service-provider\/end-of-service-report\/.*\/further-information/)
    await page.click('button.govuk-button')
    await page.waitForURL(/service-provider\/end-of-service-report\/.*\/check-answers/)
    await page.click('button.govuk-button')
    await page.waitForURL(/service-provider\/end-of-service-report\/.*\/confirmation/)
}
