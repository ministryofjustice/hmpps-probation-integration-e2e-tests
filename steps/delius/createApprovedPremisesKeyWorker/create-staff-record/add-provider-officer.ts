import { expect, type Page } from '@playwright/test'
import { deliusPerson } from '../../utils/person'
import { DateTime } from 'luxon'
import {formatDate, subDays} from "../../utils/date-time"

export const addProviderOfficerDetails = async (page: Page) => {
    // Use subDays to subtract 30 days from the current date
    const pastDate = formatDate(subDays(DateTime.now(), 30), 'dd/MM/yyyy') // Using the existing formatDate function
    const person = deliusPerson()

    await page.getByLabel('Title:').selectOption({ label: 'Mr' })
    await page.getByLabel('Surname:').fill(person.lastName)
    await page.getByLabel('Forename:').fill(person.firstName)
    await page.getByLabel('Grade:').selectOption({ label: 'CRC - Additional Grade' })

    // Clear the Start Date field and fill it with the past date
    await page.getByLabel('Start Date:').selectText()
    await page.getByLabel('Start Date:').press('Backspace')
    await page.getByLabel('Start Date:').fill(pastDate)

    await page.locator('input', { hasText: 'Save' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')

    return person
}
