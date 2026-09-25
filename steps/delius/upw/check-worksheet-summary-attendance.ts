import { expect, type Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'
import { waitForAjax } from '../utils/refresh'

export type CheckWorksheetSummaryAttendanceOptions = {
    crn: string
    eventNumber?: number
    appointmentsOffered: number
    appointmentsComplied: number
    appointmentsNotComplied: number
}

export default async function checkWorksheetSummaryAttendance(
    page: Page,
    {
        crn,
        eventNumber = 1,
        appointmentsOffered,
        appointmentsComplied,
        appointmentsNotComplied,
    }: CheckWorksheetSummaryAttendanceOptions
): Promise<void> {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await waitForAjax(page)

    const attendanceTable = page.getByRole('table').nth(2)
    const valuesRow = attendanceTable.getByRole('row').nth(2)
    const attendanceValues = await valuesRow.getByRole('cell').allTextContents()

    expect(attendanceValues[0]).toContain(appointmentsOffered.toString())
    expect(attendanceValues[1]).toContain(appointmentsComplied.toString())
    expect(attendanceValues[2]).toContain(appointmentsNotComplied.toString())
}
