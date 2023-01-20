import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findEventByCRN } from '../event/find-events.js'
import { DeliusDateFormatter, Yesterday } from '../utils/date-time.js'

export const createRelease = async (page: Page, crn: string, eventNumber = 1) => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('button', { name: 'Throughcare' }).click()
    await expect(page.locator('h1')).toHaveText('Throughcare Details')
    await page.getByRole('button', { name: 'Add Release' }).click()
    await expect(page.locator('h1')).toHaveText('Add Release')
    await page.getByLabel(/Actual Release Date/).fill(DeliusDateFormatter(Yesterday))
    await page.getByLabel(/Release Type/).selectOption('Adult Licence')
    await selectOption(page, '#addRelease\\:Institution')
    await page.getByRole('button', { name: 'Save' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.locator('h1')).toHaveText('Add Licence Conditions')
}
