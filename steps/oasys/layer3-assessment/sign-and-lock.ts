import { expect, type Page } from '@playwright/test'

export const signAndlock = async (page: Page, role?: string) => {
    await page.getByRole('link', { name: 'Summary Sheet' }).click()
    await page.locator('#B1720617953204991').click()
    await page.getByRole('button', { name: 'Sign & Lock' }).click()
    await page.getByRole('button', { name: 'Mark 1 to 9 as Missing' }).click()
    if (role !== 'ApprovedPSORole') {
        // await page.locator('[value="Continue with Signing"]').click()
        const continueButton = await page.locator('[value="Continue with Signing"]')
        if (await continueButton.isVisible()) {
            await continueButton.click()
        }
    }
    const continueWithSigningBtn = page.locator('[value="Continue with Signing"]')

    // Click 'Continue with Signing' if it is visible
    if (await continueWithSigningBtn.isVisible()) {
        await continueWithSigningBtn.click()
    }

    await page.getByRole('button', { name: 'Confirm Sign & Lock' }).click()

    // If role is not 'ApprovedPSORole', verify the header is 'Task Manager'
    if (role !== 'ApprovedPSORole') {
        const taskManagerHeader = page.locator('#searchtop > h2')
        await taskManagerHeader.isVisible({ timeout: 15000 })
        await expect(taskManagerHeader).toHaveText('Task Manager')
    }
}
