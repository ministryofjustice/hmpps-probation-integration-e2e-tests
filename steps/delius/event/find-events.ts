import { expect, Page } from '@playwright/test'
import { findOffenderByCRN, isInOffenderContext } from '../offender/find-offender'

export async function findEventByCRN(page: Page, crn: string, eventNumber: number) {
    if (await isInEventContext(page, crn, eventNumber)) {
        // Already in event context, go to event details
        await page.click('#linkNavigation3KeyData')
    } else {
        // Search for event
        await findOffenderByCRN(page, crn)
        await page.click('#linkNavigation2EventList')
        await expect(page).toHaveTitle(/Events/)
        await page.locator('tr', { hasText: eventNumber.toString() }).locator('a', { hasText: 'View' }).click()
    }
    await expect(page).toHaveTitle(/Event Details/)
}

export async function isInEventContext(page: Page, crn: string, eventNumber: number): Promise<boolean> {
    const eventOverview = page.locator('#event-overview > div > span:nth-child(1)')
    return (
        (await isInOffenderContext(page, crn)) &&
        (await eventOverview.count()) > 0 &&
        (await eventOverview.first().textContent()).startsWith(`Event:${eventNumber.toString()}`)
    )
}
