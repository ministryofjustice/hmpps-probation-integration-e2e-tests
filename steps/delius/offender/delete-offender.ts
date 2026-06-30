import { type Page } from '@playwright/test'
import { findOffenderByCRN } from './find-offender'

export async function deleteOffender(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
}
