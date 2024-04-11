import { expect, type Page } from '@playwright/test'

export const signAndlock = async (page: Page) => {
    await page.getByRole('link', { name: 'Summary Sheet' }).click()
    await page.locator('#B1720617953204991').click()
    await page.getByRole('button', { name: 'Sign & Lock' }).click()
    await page.getByRole('button', { name: 'Mark 1 to 9 as Missing' }).click()
    await page.getByRole('button', { name: 'Confirm Sign & Lock' }).click()
    await page.locator('#searchtop > h2').isVisible({ timeout: 15000 })
    await expect(page.locator('#searchtop > h2')).toHaveText('Task Manager')
}
