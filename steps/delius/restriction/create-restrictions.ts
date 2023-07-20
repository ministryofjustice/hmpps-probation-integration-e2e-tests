import { expect, Page } from '@playwright/test'
import { selectOption, selectOptionAndWait } from '../utils/inputs'

export async function createRestrictions(page: Page, args: { crn: string; users: string[] }) {
    await page.click('#linkNavigation1DataMaintenance')
    await page.getByTitle('Select this option to manage offender restrictions.').click()
    await page.fill('#restrictionListForm\\:CRN', args.crn)
    await page.click('#restrictionListForm\\:searchButton')
    await page.locator('#restrictionListForm\\:OffenderName').isVisible()

    for (const username of args.users) {
        await page.click('#restrictionListForm\\:insertRestriction')
        await expect(page).toHaveTitle('Add Restriction')

        await page.fill('#UserID', username)
        await page.getByTitle('Select to locate the user').click()
        await selectOption(page, '#RestrictionReason', 'Other')
        await selectOptionAndWait(page, '#TransferToTrust', 'North East Region')
        await selectOptionAndWait(page, '#RestrictionStartTeam', 'Automated Allocation Team')
        await selectOption(page, '#RestrictionStartOfficer', 'Handover, Calculation')
        await page.click('input.btn-primary')
        await page.locator('div.prompt-warning').isVisible()
        await page.click('input.btn-primary')
    }
}
