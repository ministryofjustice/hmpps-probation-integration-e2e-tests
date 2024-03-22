import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findEventByCRN } from '../event/find-events'
import { DeliusDateFormatter, Yesterday } from '../utils/date-time'
import { doUntil } from '../utils/refresh'

export const createRelease = async (
    page: Page,
    crn: string,
    eventNumber = 1,
    temporary = false,
    releaseDate: Date = Yesterday
) => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('button', { name: 'Throughcare' }).click()
    await expect(page.locator('h1')).toHaveText('Throughcare Details')
    await page.getByRole('button', { name: 'Add Release' }).click()
    await expect(page.locator('h1')).toHaveText('Add Release')
    await page.getByLabel(/Actual Release Date/).fill(DeliusDateFormatter(releaseDate))
    if (temporary) {
        await page.getByLabel(/Release Type/).selectOption('Release on Temporary Licence')
    } else {
        await page.getByLabel(/Release Type/).selectOption('Adult Licence')
    }

    if (temporary) {
        await expect(page.locator('#rotlLength\\:inputText')).toHaveCount(1)
        await page.getByLabel(/Release on Licence Length/).fill('1')
        await page.getByLabel(/Release on Licence End Date/).fill(DeliusDateFormatter(new Date()))
    }
    await selectOption(page, '#institution\\:selectOneMenu')
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
