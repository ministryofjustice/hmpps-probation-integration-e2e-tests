import { expect, Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { getCurrentDay } from '../utils/date-time'
import { findOffenderByCRN } from '../offender/find-offender'

export async function allocateCurrentCaseToUpwProject(
    page: Page,
    {
        crn,
        providerName,
        teamName,
        projectName = null,
        day = getCurrentDay(),
        startTime = '10:00',
        endTime = '16:00',
        projectType = 'Group Placement - National Project',
        pickupPoint = null,
    }: {
        crn: string
        providerName: string
        teamName: string
        projectName?: string
        day?: string
        startTime?: string
        endTime?: string
        projectType?: string
        pickupPoint?: string
    }
) {
    await findOffenderByCRN(page, crn)
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
    await page.locator('#startTime\\:timePicker').fill(startTime)
    await page.locator('#endTime\\:timePicker').fill(endTime)
    await selectOption(page, '#pickupPlace\\:selectOneMenu', pickupPoint)
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.locator('#currentAllocationsTable tbody > tr')).toHaveCount(1)

    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.locator('#content > h1')).toContainText('Schedule UPW Appointments')

    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.locator('#content > h1')).toContainText('View UPW Details')

    console.log("Case allocated to UPW project '%s' on %s", projectName, day)
}

export const setAllocationOutcome = async (
    page: Page,
    {
        crn,
        contactOutcome = 'Rescheduled - Service Request',
    }: {
        crn: string
        contactOutcome?: string
    }
): Promise<void> => {
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.locator('#eventsTable tbody tr').first().locator('a[title="View event"]').click()
    await page.getByRole('link', { name: 'Unpaid work' }).click()
    await page.getByRole('button', { name: 'Worksheet Summary' }).click()
    await page
        .locator('#appointmentsTable tbody tr')
        .first()
        .locator('a[title="Link to update the UPW attendance details."]')
        .click()
    await selectOption(page, '#contactOutcome\\:selectOneMenu', contactOutcome)
    await page.getByRole('button', { name: 'Save' }).click()
}
