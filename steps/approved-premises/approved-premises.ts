import { type Page, expect } from '@playwright/test'

export const selectCreatePlacementAction = async (page: Page) => {
    const actionsButton = await page.locator('button', { hasText: 'Actions' })
    await actionsButton.click()
    const listButton = await page.locator('a', { hasText: 'Create a placement' })
    await listButton.click()
    await expect(page.locator('#main-content h1')).toHaveText('Create a placement')
}
