import { expect, type Page } from '@playwright/test'

export async function startUPWAssessmentFromDelius(page: Page): Promise<Page> {
    await expect(page.locator('#content > h1')).toHaveText('Personal Details')
    await page.getByRole('button', { name: 'Update' }).click()
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.locator('#linkNavigation3UnpaidWork').click()
    await expect(page.locator('#content > h1')).toHaveText('View UPW Details')
    const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('link', { name: 'Assessment', exact: true }).click(),
    ])
    return popup
}
