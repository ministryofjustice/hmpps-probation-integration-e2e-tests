import { type Page } from '@playwright/test'

export const reallocateApplication = async (page: Page, personName: string) => {
    await page.getByRole('link', { name: 'Workflow' }).click()
    await page.getByRole('link', { name: `Reallocate task for ${personName}` }).click()
    await page.pause()
    await page
        .getByRole('row', { name: /AutomatedTestUser AutomatedTestUser/ })
        .getByRole('button', { name: 'Allocate' })
        .click()
}
