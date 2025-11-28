import { expect, Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { getCurrentDay } from '../utils/date-time'

export async function allocateCurrentCaseToUpwProject(
    page: Page,
    {
        providerName,
        teamName,
        projectName,
        day = getCurrentDay(),
        projectType = 'Group Placement - National Project',
    }: {
        providerName: string
        teamName: string
        projectName: string
        day?: string
        projectType?: string
    }
) {
    await expect(page.locator('#content > h1')).toContainText('Personal Details')
    await page.getByRole('button', { name: 'Update' }).click()
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.locator('a', { hasText: 'Unpaid Work' }).click()
    await expect(page.locator('#content > h1')).toContainText('View UPW Details')

    await page.getByRole('button', { name: 'Allocations' }).click()
    await expect(page.locator('#content > h1')).toContainText('Schedule UPW Appointments')

    await selectOption(page, '#area\\:selectOneMenu', providerName)
    await selectOption(page, '#selectionDay\\:selectOneMenu', day)
    await selectOption(page, '#projectType\\:selectOneMenu', projectType)
    await selectOption(page, '#team\\:selectOneMenu', teamName)
    await selectOption(page, '#project\\:selectOneMenu', projectName)
    await selectOption(page, '#allocationDay\\:selectOneMenu')
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.locator('#currentAllocationsTable tbody > tr')).toHaveCount(1)

    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.locator('#content > h1')).toContainText('Schedule UPW Appointments')

    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.locator('#content > h1')).toContainText('View UPW Details')

    console.log("Case allocated to UPW project '%s' on %s", projectName, day)
}
