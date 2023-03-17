import { type Page, expect } from '@playwright/test'

export const selectCreatePlacementAction = async (page: Page) => {
    const actionsButton = await page.locator('button', { hasText: 'Actions' })
    await actionsButton.click()
    const listButton = await page.locator('a', { hasText: 'Create a placement' })
    await listButton.click()
    await expect(page.locator('#main-content div > h1')).toHaveText('Create a placement')
}

export const managePlacement = async (page: Page, crn: string) => {
    await page.locator('a', { hasText: 'Upcoming Arrivals' }).click()
    await page.locator('#upcoming-arrivals tr', { hasText: crn }).first().locator('a', { hasText: 'Manage' }).click()
}
