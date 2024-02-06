import { type Page } from '@playwright/test'

export const reallocateApplication = async (page: Page, personName: string) => {
    await page.getByRole('link', { name: 'Task allocation' }).click()
    await page.getByRole('link', { name: 'Unallocated' }).click()
    await page.getByRole('link', { name: `${personName}` }).click()
    await page
        .getByRole('row', { name: /AutomatedTestUser AutomatedTestUser/ })
        .getByRole('button', { name: 'Allocate' })
        .click()
}
