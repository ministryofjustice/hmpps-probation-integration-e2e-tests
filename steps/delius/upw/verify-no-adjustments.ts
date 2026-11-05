import { expect, Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'
import { waitForAjax } from '../utils/refresh'

interface Options {
    crn: string
    eventNumber?: number
}

export default async function verifyNoAdjustments(page: Page, { crn, eventNumber = 1 }: Options): Promise<void> {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Adjustment' }).click()
    await waitForAjax(page)

    expect(page.getByText('No adjustment records were found')).toBeVisible()
}
