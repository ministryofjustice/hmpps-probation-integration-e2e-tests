import { expect, Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'
import { waitForAjax } from '../utils/refresh'
import { fillDate, selectOption } from '../utils/inputs'

interface Options {
    crn: string
    eventNumber?: number
    projectName: string
    date: Date
    providerName: string
    teamName: string
    startTime?: string
    endTime?: string
    supervisorName?: string
    projectType: string
    allocation: string
}

export default async function createUpwAppointment(
    page: Page,
    {
        crn,
        eventNumber = 1,
        projectName,
        date,
        providerName,
        teamName,
        startTime,
        endTime,
        supervisorName = 'Unallocated',
        projectType,
        allocation
    }: Options,
): Promise<void> {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')

    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await waitForAjax(page)

    await page.getByRole('button', { name: 'Add appointment' }).click()
    await waitForAjax(page)

    await fillDate(page, '#appointmentDate\\:datePicker', date)
    await selectOption(page, '#trustList\\:selectOneMenu', providerName)
    await selectOption(page, '#projectTeamList\\:selectOneMenu', teamName)
    await selectOption(page, '#project\\:selectOneMenu', projectName)
    await selectOption(page, '#projectType\\:selectOneMenu', projectType)
    await selectOption(page, '#projectAvailability\\:selectOneMenu', allocation)
    await waitForAjax(page)

    if (startTime) {
        await page.fill('#startTime\\:timePicker', startTime)
    }

    if (endTime) {
        await page.fill('#endTime\\:timePicker', endTime)
    }

    await selectOption(page, '#supervisorTeam\\:selectOneMenu', teamName)
    await selectOption(page, '#supervisorEmployee\\:selectOneMenu', supervisorName)
    await page.getByRole('button', { name: 'Save' }).click()
    await waitForAjax(page)

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Worksheet Summary')
}
