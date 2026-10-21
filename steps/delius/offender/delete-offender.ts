import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from './find-offender'

// Delius won't delete a person with active events, so delete every event first
async function deleteEvents(page: Page) {
    await page.getByRole('link', { name: 'Event List' }).click()
    await expect(page).toHaveTitle(/Events/)
    const deleteEventLinks = page.getByTitle('Delete event', { exact: true })
    while ((await deleteEventLinks.count()) > 0) {
        await deleteEventLinks.first().click()
        await expect(page).toHaveTitle(/Delete Event/)
        await page.getByRole('button', { name: 'Confirm' }).click()
        // Wait for the delete to complete before doing anything else, otherwise the request can be interrupted
        await expect(page).toHaveTitle(/Events/)
    }
}

export async function deleteOffender(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await deleteEvents(page)
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await expect(page).toHaveTitle(/Personal Details/)
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page).toHaveTitle(/Delete Whole Record/)
    // Delius hides the Confirm button and shows an error if the record can't be deleted
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page).not.toHaveTitle(/Delete Whole Record/)
}
