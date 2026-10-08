import { type Page, expect } from '@playwright/test'

export const enterCRN = async (page: Page, crn: string) => {
    await page.fill('#crn', crn)
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Approved Premises - Confirm/)
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    const cas2Heading = page.getByRole('heading', {
        name: /may be eligible for short-term accommodation/i,
    })

    if (await cas2Heading.isVisible()) {
        await page.getByRole('button', { name: 'Continue' }).click()
    }
    // If the link to apply for CAS1 anyway appears, click it. Otherwise, continue.
    try {
        await page
            .getByRole('link', { name: 'Apply for Approved Premises (CAS1) anyway' })
            .waitFor({ state: 'visible', timeout: 5000 })

        await page.getByRole('link', { name: 'Apply for Approved Premises (CAS1) anyway' }).click()
    } catch {
        // Link didn't appear within 5 seconds, continue
    }
}
