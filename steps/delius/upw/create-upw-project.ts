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
): Promise<{ projectCode: string; projectName: string; projectAvailability: ProjectAvailability }> {
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
    const availability = await addProjectAvailability(page, projectAvailability)
    return { projectCode, projectName, projectAvailability: availability }
}

export function createNameWithTimeStamp(prefix = 'project'): string {
    return `${prefix}-${DateTime.now().toFormat('ddMMyyyyHHmmss')}`
}

async function addProjectAvailability(
    page: Page,
    projectAvailability: ProjectAvailability
): Promise<ProjectAvailability> {
    const timeNow = DateTime.now()
    // default duration set to 4 hours to ensure the appointment ends on the same day (when running before 8pm)
    const timeLater = timeNow.plus({ hours: 4 })

    const {
        day = getCurrentDay(),
        frequency = 'Weekly',
        startDate = new Date(),
        endDate = Tomorrow.toJSDate(),
        startTime = timeNow.toISOTime({ precision: 'minute', includeOffset: false }),
        endTime = timeLater.toISOTime({ precision: 'minute', includeOffset: false }),
    } = projectAvailability

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
    return { day, frequency, startDate, endDate, startTime, endTime }
}
