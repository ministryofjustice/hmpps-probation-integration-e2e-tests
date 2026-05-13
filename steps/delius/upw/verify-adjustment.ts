import { Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'
import { verifyTableRowByContent } from '../utils/table'
import { waitForAjax } from '../utils/refresh'

interface Options {
    crn: string
    eventNumber?: number
    reason: string
    hoursCredited: string // in format (-)H:mm
}

export default async function verifyAdjustment(
    page: Page,
    { crn, eventNumber = 1, reason, hoursCredited }: Options
): Promise<void> {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Adjustment' }).click()
    await waitForAjax(page)

    const toVerify = [
        { columnName: 'Adjustment', cellContent: hoursCredited },
    ]

    await verifyTableRowByContent(page, 'currentAdjustmentsTable', reason, toVerify)
}
