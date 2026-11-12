import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from './find-offender'
import { selectOption } from '../utils/inputs'

export class OffenderDeletionRejectedError extends Error {
    constructor(crn: string, message: string) {
        super(`Deletion of ${crn} could not be verified: ${message}`)
        this.name = 'OffenderDeletionRejectedError'
    }
}

export class OffenderDeletionExceptionError extends Error {
    constructor(crn: string) {
        super(`Delius displayed National Delius Error Page while deleting ${crn}; deletion outcome unknown`)
        this.name = 'OffenderDeletionExceptionError'
    }
}

// Delius won't delete a person with active events, so delete every event first
async function deleteEvents(page: Page) {
    await page.getByRole('link', { name: 'Event List' }).click()
    const deleteEventLinks = page.getByTitle('Delete event', { exact: true })
    while (true) {
        // Wait for the initial list and every post-deletion return before inspecting the remaining events.
        await page.waitForURL(url => url.pathname.endsWith('/sentencing/eventslist.xhtml'), {
            waitUntil: 'load',
            timeout: 30000,
        })
        await expect(page).toHaveTitle(/Events/, { timeout: 30000 })
        await expect(page.getByRole('heading', { name: 'Events', exact: true })).toBeVisible({ timeout: 30000 })
        if ((await deleteEventLinks.count()) === 0) break
        await deleteEventLinks.first().click()
        await expect(page).toHaveTitle(/Delete Event/)
        await page.getByRole('button', { name: 'Confirm' }).click()
    }
}

export async function deleteOffender(page: Page, crn: string) {
    try {
        await deleteOffenderRecord(page, crn)
    } catch (error) {
        if (await page.getByRole('heading', { name: 'National Delius Error Page', exact: true }).isVisible()) {
            throw new OffenderDeletionExceptionError(crn)
        }
        throw error
    }
}

async function deleteOffenderRecord(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await deleteEvents(page)
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await expect(page).toHaveTitle(/Personal Details/)
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page).toHaveTitle(/Delete Whole Record/)
    // Delius hides the Confirm button and shows an error if the record can't be deleted
    await page.getByRole('button', { name: 'Confirm' }).click()
    const validationError = page.getByText('Validation Errors', { exact: true })
    await expect
        .poll(
            async () =>
                new URL(page.url()).pathname.endsWith('/search/findoffenders.xhtml') ||
                (await validationError.isVisible()) ||
                (await page.getByRole('heading', { name: 'National Delius Error Page', exact: true }).isVisible()),
            { timeout: 30000 }
        )
        .toBe(true)
    if (await page.getByRole('heading', { name: 'National Delius Error Page', exact: true }).isVisible()) {
        throw new OffenderDeletionExceptionError(crn)
    }
    if (await validationError.isVisible()) {
        const message = await validationError.locator('..').innerText()
        console.warn(`Validation error after confirming deletion of ${crn}: ${message}`)
        await page.getByRole('button', { name: 'Close', exact: true }).click()
        await page.waitForURL(url => !url.pathname.endsWith('/deleteoffender.xhtml'), { waitUntil: 'load' })
        await expect(page).not.toHaveTitle(/Delete Whole Record/)
        await page.locator('a', { hasText: 'National search' }).click()
        await expect(page).toHaveTitle(/National Search/)
        await page.fill('#crn\\:inputText', crn)
        await selectOption(page, '#otherIdentifier', '[Not Selected]')
        await page.click('#searchButton')
        const noRecords = page.locator('.noRecordsFound:has-text("No records found")')
        const results = page.locator('#offendersTable')
        await expect(noRecords.or(results)).toBeVisible({ timeout: 10000 })
        if (!(await noRecords.isVisible())) {
            throw new OffenderDeletionRejectedError(crn, message)
        }
        console.log(`Verified deletion of ${crn}: fresh National Search returned no records`)
    } else {
        await page.waitForURL('**/search/findoffenders.xhtml?*', { waitUntil: 'load' })
        await expect(page).toHaveTitle(/National Search/)
        await expect(page.locator('#crn\\:inputText')).toBeVisible()
    }
}
