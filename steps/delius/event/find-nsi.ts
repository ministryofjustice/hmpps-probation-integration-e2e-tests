import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender'
import { findEventByCRN } from './find-events'

export async function findNSIByCRN(page: Page, crn: string, eventNumber: number, NSIText: string) {
    // Search for event
    await findOffenderByCRN(page, crn)
    await findEventByCRN(page, crn, eventNumber)

    // Find the correct NSI in the list
    await page.click('#navigation-include\\:linkNavigation3EventNsi')
    await expect(page).toHaveTitle(/Non Statutory Intervention List/)
    await page.locator('main[role="main"]').locator('a', { hasText: 'view' }).click()
    await expect(page).toHaveTitle(/Non Statutory Intervention Details/)
    await expect(page.locator("span:right-of(:text('NSI Provider:'))", { hasText: NSIText })).not.toHaveCount(0)
}
