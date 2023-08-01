import { expect, type Page } from '@playwright/test'
import { deliusPerson } from '../../utils/person'
import { format, subDays } from 'date-fns'

export const addProviderOfficerDetails = async (page: Page) => {
    const pastDate = format(subDays(new Date(), 30), 'dd/MM/yyyy')
    const person = deliusPerson()
    await page.getByLabel('Title:').selectOption({ label: 'Mr' })
    await page.getByLabel('Surname:').fill(person.lastName)
    await page.getByLabel('Forename:').fill(person.firstName)
    await page.getByLabel('Grade:').selectOption({ label: 'CRC - Additional Grade' })
    await page.getByLabel('Start Date:').selectText()
    await page.getByLabel('Start Date:').press('Backspace')
    await page.getByLabel('Start Date:').fill(pastDate)
    await page.locator('input', { hasText: 'Save' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')
    return person
}
