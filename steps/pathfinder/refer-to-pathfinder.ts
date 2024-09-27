import { expect, type Page } from '@playwright/test'
import { HmppsDateFormatter } from '../delius/utils/date-time.js'

export const referToPathfinder = async (page: Page, crn: string) => {
    // Search for CRN
    await page.getByRole('link', { name: 'Refer from the community' }).click()
    await page.getByLabel('CRN').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: 'Refer to Pathfinder' }).click()
    // Accept non-custodial case
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    // Enter reason for referral
    await page.getByLabel('Reason for referral').fill('Automated testing')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    // Check referral was successful
    await expect(page.getByRole('heading', { name: 'Referral successful' })).toBeVisible()
}

export const pathfinderDateFormatter = (date: Date | string): string => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    return HmppsDateFormatter(parsedDate)
}
