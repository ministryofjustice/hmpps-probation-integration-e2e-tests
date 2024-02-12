import { type Page, expect } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh'

export const clickCreateRSRAssessmentButton = async (page: Page) => {
    await page.click('#B3003147759868925')
    await refreshUntil(page, () =>
        expect(page.locator('#breadcrumbleft')).toHaveText('SearchOffender DetailsOffender RSR Score')
    )
}
