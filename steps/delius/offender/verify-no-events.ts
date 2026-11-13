import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { waitForAjax } from '../utils/refresh'

export async function verifyNoEvents(page: Page): Promise<void> {
    await page.getByRole('link', { name: 'Event List', exact: true }).click()
    await expect(page).toHaveTitle(/Events/)
    const showTerminated = '[id="showActiveEventsDropdown:selectOneMenu"]'
    await selectOption(page, showTerminated, 'No')
    await waitForAjax(page)
    await expect(page.locator(showTerminated)).toHaveValue('N')
    await expect(page.locator('[id$="noRecordsMessage"] .highlight')).toBeVisible()
    await expect(page.locator('[id="eventsTable"], [id$=":eventsTable"]')).toHaveCount(0)
}
