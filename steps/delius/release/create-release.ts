import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findEventByCRN } from '../event/find-events.js'
import { DeliusDateFormatter, Yesterday } from '../utils/date-time.js'
import { doUntil } from '../utils/refresh.js'

export const createRelease = async (page: Page, crn: string, eventNumber = 1, temporary = false) => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('button', { name: 'Throughcare' }).click()
    await expect(page.locator('h1')).toHaveText('Throughcare Details')
    await page.getByRole('button', { name: 'Add Release' }).click()
    await expect(page.locator('h1')).toHaveText('Add Release')
    await page.getByLabel(/Actual Release Date/).fill(DeliusDateFormatter(Yesterday))
    if (temporary) {
        await page.getByLabel(/Release Type/).selectOption('Release on Temporary Licence')
    } else {
        await page.getByLabel(/Release Type/).selectOption('Adult Licence')
    }
    await selectOption(page, '#addRelease\\:Institution')
    if (temporary) {
        await page.getByLabel(/Release on Licence Length/).fill('1')
        await page.getByLabel(/Release on Licence End Date/).fill(DeliusDateFormatter(new Date()))
    }
    await doUntil(
        () => page.getByRole('button', { name: 'Save' }).click(),
        () => expect(page).toHaveTitle(/Add Release/)
    )
    await doUntil(
        () => page.getByRole('button', { name: 'Confirm' }).click(),
        () => expect(page).toHaveTitle(/Add Components/)
    )
    await expect(page.locator('h1')).toHaveText('Add Licence Conditions')
}
