import { type Page, expect } from '@playwright/test'
import { refreshUntil } from '../../delius/utils/refresh'

export const clickCreateAssessmentButton = async (page: Page) => {
    await page.click('#B2799414815519187')
    await expect(page.locator('h2')).toHaveText('CRN Amendment')
}

export const clickUpdateOffenderButton = async (page: Page) => {
    await page.click('#B9413703324577086')
    await refreshUntil(page, () => expect(page.locator('#contextleft > h3')).toHaveText('Create New Assessment'))
}
