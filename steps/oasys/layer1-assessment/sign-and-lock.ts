import { expect, type Page } from '@playwright/test'

export const signAndlock = async (page: Page, role?: string) => {
    await page.getByRole('button', { name: 'Sign & Lock' }).click()

    // Click 'Confirm Sign & Lock'
    await page.getByRole('button', { name: 'Confirm Sign & Lock' }).click()

    // Verify the header is 'Task Manager' if role is not 'ApprovedPSORole'
    if (role !== 'ApprovedPSORole') {
        const taskManagerHeader = page.locator('#searchtop > h2')
        await taskManagerHeader.waitFor({ timeout: 15000, state: 'visible' })
        await expect(taskManagerHeader).toHaveText('Task Manager')
    }
}
