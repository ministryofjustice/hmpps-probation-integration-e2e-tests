import { expect, type Page } from '@playwright/test'

import {type Person} from '../utils/person.js'




export const addKeyWorker = async (page: Page, person: Person) => {

    await expect(page.locator('#AddKeyWorkerForm\\:ApprovedPremises')).toHaveText('Bedford AP - Bedford')
    await page.locator("#Trust").selectOption({ label: 'NPS London' })
    await page.locator("#Team").selectOption({ label: 'Test Approved Premises Team' })
    await page.locator("#Staff").selectOption({ label: `${person.lastName}, ${person.firstName} (CRC - Additional Grade)` })

    await page.locator('input', { hasText: 'Save' }).click()


    // Mason, John (CRC - Additional Grade)




}
