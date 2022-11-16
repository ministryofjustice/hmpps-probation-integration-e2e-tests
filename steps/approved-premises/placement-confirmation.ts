import {type Page, expect} from '@playwright/test'

export const clickBackToDashboard = async (page: Page) => {
    await page.locator('a', {hasText: 'Back to dashboard'}).click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement details')
}
