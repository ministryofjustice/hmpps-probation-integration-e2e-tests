import { expect, type Page } from '@playwright/test'

import { deliusPerson} from '../utils/person.js'

export const searchApprovedPremises = async (page: Page) => {
    // await page.locator("#SearchForm\\:Title").selectOption({ label: 'Mr' })
    // await page.fill("#SearchForm\\:Surname" ,person.lastName);
    // await page.fill("#SearchForm\\:Forename" ,person.firstName);
    // await page.locator("#SearchForm\\:Grade").selectOption({ label: 'CRC - Additional Grade' })
    // await page.locator("#StartDate").selectText();
    // await page.locator("#StartDate").press("Backspace");
    // await page.fill("#StartDate" ,'12/09/2022');
    await page.click("#linkNavigation1ReferenceData")
    await expect(page.locator('#content > h1')).toHaveText('Reference Data')
    await page.click("[title='Select to access the locally maintained link list of Approved Premises and Key Workers']")
    await expect(page.locator('#content > h1')).toHaveText('Approved Premises Key Workers')
    await page.locator("#APList").selectOption({ label: 'Bedford AP - Bedford' })
    await page.click("#ApprovedPremisesKeyWorkersForm\\:j_id_id34")
    await page.click("#ApprovedPremisesKeyWorkersForm\\:j_id_id69")

}


