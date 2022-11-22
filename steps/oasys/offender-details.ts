import { type Page, expect } from '@playwright/test'

export const clickCreateRSRAssessmentButton = async (page: Page) => {
    await page.click('#B3003147759868925')
    await expect(page.locator('#breadcrumbleft')).toHaveText('SearchOffender DetailsOffender RSR Score')
}


