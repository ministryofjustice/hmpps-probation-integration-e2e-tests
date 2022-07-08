import { Page, expect } from '@playwright/test'

export const viewAllocation = async (page: Page, crn: string) => {
    await page.locator('tr', { hasText: crn }).locator('a', { hasText: 'Review case' }).click()
    await expect(page.locator('.govuk-caption-xl', { hasText: crn })).toHaveText(`CRN: ${crn}`)
}

export const allocateCase = async (page: Page, crn: string) => {
    // Navigate to allocation page
    await page.locator('a', { hasText: 'Allocate case' }).click()
    await expect(page).toHaveTitle(/.*Choose practitioner.*/)

    // Allocate to practitioner
    await page.locator('tr', { hasText: 'Carlo Veo' }).locator('.govuk-radios__input').click()
    await page.locator('button', { hasText: 'Allocate case' }).click()

    // Confirm allocation to practitioner
    await expect(page).toHaveTitle(/.*Allocate to practitioner.*/)
    await page.locator('a', { hasText: 'Continue' }).click()

    // Review and submit allocation to practitioner
    await expect(page).toHaveTitle(/.*Review allocation instructions.*/)
    await page.fill('id=instructions', `Allocation for ${crn} completed by hmpps-end-to-end-tests`)
    await page.locator('button', { hasText: 'Continue' }).click()
}
