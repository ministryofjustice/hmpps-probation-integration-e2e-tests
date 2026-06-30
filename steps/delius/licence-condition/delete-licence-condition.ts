import { expect, type Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'

export const deleteLicenceConditions = async (page: Page, crn: string, eventNumber = 1): Promise<void> => {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('link', { name: 'Licence Conditions' }).click()
    await expect(page.locator('h1')).toContainText('Licence Conditions')

    // Get all "delete" links
    const deleteLinks = await page.locator('#licenceConditionTable [title="Delete licence condition"]').all()

    // Iterate over each delete link and click on it
    for (const deleteLink of deleteLinks) {
        await deleteLink.click()
        await expect(page.locator('#content > h1')).toContainText('Delete Licence Condition')
        await page.getByRole('button', { name: 'Confirm' }).click()
        await expect(page.locator('h1')).toContainText('Licence Conditions')
    }
}
