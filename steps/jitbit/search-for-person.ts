import { type Page } from '@playwright/test'

export const searchForPerson = async (page: Page, crn: string) => {
    await page.getByRole('link', { name: 'Create New Ticket' }).click()
    if (page.url().includes('Login')) {
        await page.fill('#Username', process.env.JITBIT_USERNAME!)
        await page.fill('#Password', process.env.JITBIT_PASSWORD!)
        await page.getByRole('button', { name: 'Login' }).click()
    }
    const category = 'EM-Enforcement > Breach Withdrawal Letter'
    await page.getByRole('combobox', { name: 'Start typing your category' }).fill(category)
    await page.getByRole('link', { name: 'EM-Enforcement > Breach' }).click()
    await page.getByRole('textbox', { name: '* CRN: Search CRN' }).fill(crn)
    await page.getByRole('button', { name: 'Search CRN' }).click()
}
