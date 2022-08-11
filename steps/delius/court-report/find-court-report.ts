import { expect, Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'

export async function findCourtReport(page: Page, crn: string, eventNumber = 1, courtReportNumber = 1) {
    await findEventByCRN(page, crn, eventNumber)
    await page.locator('#linkNavigation3Reports').click()
    await expect(page).toHaveTitle(/Court And Institutional Reports/)
    await page
        .locator('#reportListForm\\:courtReportTable a', { hasText: 'view' })
        .nth(courtReportNumber - 1)
        .click()
    await expect(page).toHaveTitle(/View Court Report/)
}
