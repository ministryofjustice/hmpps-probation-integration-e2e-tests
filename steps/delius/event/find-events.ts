import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN, isInOffenderContext } from '../offender/find-offender'
import { DeliusDateFormatter } from '../utils/date-time'
import { refreshUntil } from '../utils/refresh'

export async function findEventByCRN(page: Page, crn: string, eventNumber: number) {
    if (await isInEventContext(page, crn, eventNumber)) {
        // Already in event context, go to event details
        await page.click('#navigation-include\\:linkNavigation3KeyData')
    } else {
        // Search for event
        await findOffenderByCRN(page, crn)
        await page.click('#navigation-include\\:linkNavigation2EventList')
        await expect(page).toHaveTitle(/Events/)
        await page.locator('tr', { hasText: eventNumber.toString() }).locator('a', { hasText: 'View' }).click()
    }
    await expect(page).toHaveTitle(/Event Details/)
}

export async function findCustodyForEventByCRN(page: Page, crn: string, eventNumber: number) {
    await findEventByCRN(page, crn, eventNumber)
    await page.locator('input.btn', { hasText: 'Throughcare' }).click()
    await expect(page).toHaveTitle(/Throughcare Details/)
}

export async function isInEventContext(page: Page, crn: string, eventNumber: number): Promise<boolean> {
    const eventOverview = page.locator('#event-overview > div > span:nth-child(1)')
    return (
        (await isInOffenderContext(page, crn)) &&
        (await eventOverview.count()) > 0 &&
        (await eventOverview.first().textContent()).startsWith(`Event:${eventNumber.toString()}`)
    )
}

export const verifyKeyDates = async (page: Page, crn: string, eventNumber: number, date: Date) => {
    await findCustodyForEventByCRN(page, crn, eventNumber)
    await refreshUntil(page, () => verifyDate(page, 'Sentence Expiry Date:', date), { timeout: 120_000 })
    await verifyDate(page, 'Sentence Expiry Date:', date)
    await verifyDate(page, 'Licence Expiry Date:', date)
    await verifyTableDate(page, 'Parole Eligibility Date', date)
    await verifyTableDate(page, 'Auto-Conditional Release Date', date)
}

const verifyDate = async (page: Page, label: string, date: Date) => {
    const id = await page.locator('label', { hasText: label }).getAttribute('for')
    await expect(page.locator(`[id="${id}"]`)).toHaveText(DeliusDateFormatter(date))
}

const verifyTableDate = async (page: Page, label: string, date: Date) => {
    const matchingRecord = page.locator('tr', { hasText: label })
    await expect(matchingRecord).toContainText(DeliusDateFormatter(date))
}
