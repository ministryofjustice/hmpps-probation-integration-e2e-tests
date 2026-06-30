import { Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'
import { verifyTableRowByContent } from '../utils/table'
import { waitForAjax } from '../utils/refresh'

interface Options {
    crn: string
    eventNumber?: number
    projectName: string
    date: Date
    hoursCredited: string // in format H:mm
    outcome: string
}

export default async function verifyTimeCredited(
    page: Page,
    { crn, eventNumber = 1, projectName, hoursCredited, outcome }: Options
): Promise<void> {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await waitForAjax(page)

    const toVerify = [
        { columnName: 'Hrs Credited', cellContent: hoursCredited },
        { columnName: 'Outcome', cellContent: outcome },
    ]

    await verifyTableRowByContent(page, 'appointmentsTable', projectName, toVerify)
}
