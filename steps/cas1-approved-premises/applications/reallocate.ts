import { type Page } from '@playwright/test'

export const reallocateApplication = async (page: Page, person: { firstName: string; lastName: string; sex: string }) => {
    await page.getByRole('link', { name: 'Task allocation' }).click()
    await page.getByRole('link', { name: 'Unallocated' }).click()
    if (person.sex === 'Female') {
        await page.getByLabel('AP area').selectOption('all')
        await page.getByRole('button', { name: 'Apply filters' }).click()
    }
    await page.getByRole('link', { name: `${person.firstName} ${person.lastName}` }).click()
    await page
        .getByRole('row', { name: /AutomatedTestUser AutomatedTestUser/ })
        .getByRole('button', { name: 'Allocate' })
        .click()
}
