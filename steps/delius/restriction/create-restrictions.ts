import { expect, Page } from '@playwright/test'
import { selectOption, selectOptionAndWait } from '../utils/inputs'

export async function createRestrictions(page: Page, args: { crn: string; users: string[] }) {
    await page.click('#navigation-include\\:linkNavigation1DataMaintenance')
    await page.getByTitle('Select this option to manage Person restrictions.').click()
    await page.fill('#crn\\:inputText', args.crn)
    await page.click('#crn\\:commandButton')
    await page.locator('#offenderName\\:outputText').isVisible()

    for (const username of args.users) {
        await page.click('#insertRestriction')
        await expect(page).toHaveTitle('Add Restriction')

        await page.fill('#search\\:inputText', username)
        await page.getByTitle('Select to locate the user').click()
        await selectOption(page, '#restrictionReason\\:selectOneMenu', 'Other')
        await selectOptionAndWait(page, '#transferToTrust\\:selectOneMenu', 'North East Region')
        await selectOptionAndWait(page, '#restrictionStartTeam\\:selectOneMenu', 'Automated Allocation Team')
        await selectOption(page, '#restrictionStartOfficer\\:selectOneMenu', 'Handover, Calculation')
        await page.click('input.btn-primary')
        await page.locator('div.prompt-warning').isVisible()
        await page.click('input.btn-primary')
    }
}
