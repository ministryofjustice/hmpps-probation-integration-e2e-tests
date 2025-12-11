import { expect, type Page } from '@playwright/test'

export const referToSOC = async (page: Page, crn: string) => {
    // Search for CRN
    await page.getByRole('link', { name: 'Add community nominal' }).click()
    await page.getByLabel('CRN').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: 'Add nominal to SOC' }).click()
    // Enter reason for referral
    await page.getByRole('radio', { name: 'Preselection' }).check()
    await page.getByLabel('Reason for referral or inclusion').fill('Automated testing')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('Directorate of Security (DoS').selectOption('North West and West Midlands')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    // Check referral was successful
    await expect(page.getByRole('heading', { name: 'Referral successful' })).toBeVisible()
}

export function formatStaffNameForSOC(name: string): string {
    // Rearrange the format of the staff name returned from Delius using regular expression
    return name.replace(/^(.*?),\s*(.*?)\s*\(.*\)$/, '$2 $1')
}
