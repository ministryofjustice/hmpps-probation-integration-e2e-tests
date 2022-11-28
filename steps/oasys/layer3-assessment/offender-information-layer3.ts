import { type Page, expect } from '@playwright/test'

export const clickCloseAssessment = async (page: Page) => {
    await page.click('#B5139215246744339')
    await expect(page.locator('#contextleft > h3')).toHaveText('Offender Details')
}
