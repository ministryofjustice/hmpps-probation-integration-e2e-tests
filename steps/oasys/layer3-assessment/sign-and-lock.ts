import { expect, type Page } from '@playwright/test'

export const signAndlock = async (page: Page, role?: string) => {
    await page.getByRole('link', { name: 'Summary Sheet' }).click()
    await page.locator('#B1720617953204991').click()
    await page.getByRole('button', { name: 'Sign & Lock' }).click()
    await page.getByRole('button', { name: 'Mark 1 to 9 as Missing' }).click()

    // Click 'Continue with Signing' if role is not 'ApprovedPSORole'
    if (role !== 'ApprovedPSORole') {
        const continueButton = await page.locator('[value="Continue with Signing"]')
        if (await continueButton.isVisible()) {
            await continueButton.click()
        }
    }

    // Click 'Confirm Sign & Lock'
    await page.getByRole('button', { name: 'Confirm Sign & Lock' }).click()

    // Verify the header is 'Task Manager' if role is not 'ApprovedPSORole'
    if (role !== 'ApprovedPSORole') {
        const taskManagerHeader = page.locator('#searchtop > h2')
        await taskManagerHeader.waitFor({ timeout: 15000, state: 'visible' })
        await expect(taskManagerHeader).toHaveText('Task Manager')
    }
}
