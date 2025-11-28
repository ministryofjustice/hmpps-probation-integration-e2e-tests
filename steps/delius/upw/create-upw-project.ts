import { expect, Page } from '@playwright/test'
import { fillDate, selectOption } from '../utils/inputs'
import { faker } from '@faker-js/faker'
import { getCurrentDay, Tomorrow } from '../utils/date-time'
import { waitForAjax } from '../utils/refresh'

export async function createUpwProject(
    page: Page,
    {
        providerName,
        teamName,
        projectType = 'Group Placement - National Project',
        pickupPoint = 'Chelmsford',
        projectName = createNameWithTimeStamp(),
        projectCode = faker.string.alphanumeric(6),
        projectAvailability = {
            day: getCurrentDay(),
            frequency: 'Weekly',
            startDate: new Date(),
            endDate: Tomorrow.toJSDate(),
            startTime: '09:00',
            endTime: '17:00',
        },
    }: {
        providerName: string
        teamName: string
        projectType?: string
        pickupPoint?: string
        projectName?: string
        projectCode?: string
        projectAvailability?: { day: string; frequency: string, startDate: Date; endDate: Date; startTime: string; endTime: string }
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
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#content > h1')).toContainText('Update Project')
    await addProjectAvailability(page, projectAvailability)
    return { projectCode, projectName }
}

export function createNameWithTimeStamp(prefix = 'project'): string {
    const now = new Date()
    const dateFormat =
        now.getDate().toString().padStart(2, '0') +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getFullYear() +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0')
    return `${prefix}-${dateFormat}`
}

async function addProjectAvailability(page: Page, projectAvailability: {
    day: string;
    frequency: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string
}) {
    await page.getByRole('button', { name: 'Project Availability' }).click()
    await selectOption(page, '#Day\\:selectOneMenu', projectAvailability.day)
    await selectOption(page, '#Frequency\\:selectOneMenu', projectAvailability.frequency)
    await fillDate(page, '#StartDate\\:datePicker', projectAvailability.startDate)
    await fillDate(page, '#EndDate\\:datePicker', projectAvailability.endDate)
    await page.fill('#StartTime\\:timePicker', projectAvailability.startTime)
    await page.fill('#EndTime\\:timePicker', projectAvailability.endTime)
    await page.locator('input[type="submit"][name="j_idt808"][value="Add"]').click()
    await waitForAjax(page)
    await page.getByRole('button', { name: 'Save' }).click()
}
