import { expect, type Page } from '@playwright/test'

import { deliusPerson} from '../utils/person.js'

export const addProviderOfficerDetails = async (page: Page) => {
    const person = deliusPerson()
    await page.locator("#SearchForm\\:Title").selectOption({ label: 'Mr' })
    await page.fill("#SearchForm\\:Surname" ,person.lastName);
    await page.fill("#SearchForm\\:Forename" ,person.firstName);
    await page.locator("#SearchForm\\:Grade").selectOption({ label: 'CRC - Additional Grade' })
    await page.locator("#StartDate").selectText();
    await page.locator("#StartDate").press("Backspace");
    await page.fill("#StartDate" ,'12/09/2022');
    await page.click("[title='Select to Save details entered & Close this screen']")
    await expect(page.locator('#content > h1')).toHaveText('Provider Officer List')
    return person
}
