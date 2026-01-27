import { expect, Page } from '@playwright/test'
import { fillDate, selectOption } from '../utils/inputs'
import { faker } from '@faker-js/faker'
import { getCurrentDay, Tomorrow } from '../utils/date-time'
import { waitForAjax } from '../utils/refresh'
import { DateTime } from 'luxon'

interface ProjectAvailability {
    day?: string
    frequency?: string
    startDate?: Date
    endDate?: Date
    startTime?: string
    endTime?: string
}

export async function createUpwProject(
    page: Page,
    {
        providerName,
        teamName,
        projectType = 'Group Placement - National Project',
        pickupPoint = 'Chelmsford',
        projectName = createNameWithTimeStamp(),
        projectCode = faker.string.alphanumeric(6),
        projectAvailability = {},
    }: {
        providerName: string
        teamName: string
        projectType?: string
        pickupPoint?: string
        projectName?: string
        projectCode?: string
        projectAvailability?: ProjectAvailability
    }
): Promise<{ projectCode: string; projectName: string }> {
    await page.getByRole('link', { name: 'UPW Projects' }).click()
    await expect(page.locator('#content > h1')).toContainText('UPW Projects List')
    await page.locator('input', { hasText: 'Add New Project' }).click()

    await expect(page.locator('#content > h1')).toContainText('Add Project')
    await selectOption(page, '#Trust\\:selectOneMenu', providerName)
    await selectOption(page, '#Team\\:selectOneMenu', teamName)
    await page.selectOption('#ProjectType\\:selectOneMenu', projectType)
    await page.selectOption('#DefaultPickupPoint\\:selectOneMenu', { label: pickupPoint })
    await page.fill('#ProjectCode\\:prependedInputText', projectCode)
    await page.fill('#ProjectName\\:inputText', projectName)
    await fillDate(page, '#ProjectStartDate\\:datePicker', new Date())
    await fillDate(page, '#ProjectEndDate\\:datePicker', Tomorrow.toJSDate())
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#content > h1')).toContainText('Update Project')
    await addProjectAvailability(page, projectAvailability)
    return { projectCode, projectName }
}

export function createNameWithTimeStamp(prefix = 'project'): string {
    return `${prefix}-${DateTime.now().toFormat('ddMMyyyyHHmmss')}`
}

async function addProjectAvailability(
    page: Page,
    {
        day = getCurrentDay(),
        frequency = 'Weekly',
        startDate = new Date(),
        endDate = Tomorrow.toJSDate(),
        startTime = '09:00',
        endTime = '17:00',
    }: ProjectAvailability
) {
    await page.getByRole('button', { name: 'Project Availability' }).click()
    await selectOption(page, '#Day\\:selectOneMenu', day)
    await selectOption(page, '#Frequency\\:selectOneMenu', frequency)
    await fillDate(page, '#StartDate\\:datePicker', startDate)
    await fillDate(page, '#EndDate\\:datePicker', endDate)
    await page.fill('#StartTime\\:timePicker', startTime)
    await page.fill('#EndTime\\:timePicker', endTime)
    await page.getByRole('button', { name: 'Add', exact: true }).nth(0).click()
    await waitForAjax(page)
    await page.getByRole('button', { name: 'Save' }).click()
}
