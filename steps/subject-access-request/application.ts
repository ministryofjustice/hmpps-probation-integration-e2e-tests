import { expect, Page } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh.js'

export async function requestSarReportForCrn(page: Page, crn: string) {
    // Request a new SAR report
    await page.getByRole('link', { name: 'Request a report' }).click()
    await page.locator('#subject-id').fill(crn)
    await page.getByRole('button', { name: /Confirm/ }).click()
    await expect(page).toHaveTitle(/Subject Access Requests/)
    await expect(page.locator('#main-content h1')).toHaveText('Enter details')

    // Enter case reference number
    await page.getByLabel('Case Reference Number').fill(crn)
    await page.getByRole('button', { name: /Confirm/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Select Services')

    // Select services
    await page.getByRole('row', { name: 'Select keyworker-api' }).locator('label').click()
    await page.getByRole('button', { name: /Confirm/ }).click()

    // Confirm report details
    await expect(page.locator('#main-content h1')).toHaveText('Please confirm report details')
    await page.getByRole('button', { name: /Accept and create report/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText(`Your report request for ${crn} has been submitted`)

    // View all reports
    await page.getByRole('link', { name: /View all reports./ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Subject Access Request Reports')

    // Search for the report
    await page.getByLabel('Find a report').fill(crn)
    await page.getByRole('button', { name: /Search/ }).click()

    // Refresh until the report is available
    const sarReportTable = page.locator('[data-module="moj-sortable-table"]')
    await refreshUntil(page, () => expect(sarReportTable).toContainText(/View report/))
}
