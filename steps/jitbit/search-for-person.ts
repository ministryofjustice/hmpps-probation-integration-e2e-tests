import { type Page } from '@playwright/test'

export const searchForPerson = async (page: Page, crn: string) => {
    await page.getByRole('link', { name: 'Create New Ticket' }).click()
    const category = 'EM-Enforcement > Breach Withdrawal Letter'
    await page.getByRole('combobox', { name: 'Start typing your category' }).fill(category)
    await page.getByRole('link', { name: 'EM-Enforcement > Breach' }).click()
    await page.getByRole('textbox', { name: '* CRN: Search CRN' }).fill(crn)
    await page.getByRole('button', { name: 'Search CRN' }).click()
}
