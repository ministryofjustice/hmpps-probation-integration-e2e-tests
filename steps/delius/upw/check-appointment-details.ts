import { expect, type Page } from '@playwright/test'
import { getRowByContent } from '../utils/table'

export type CheckAppointmentDetailsOptions = {
    projectName: string
    startTime: string
    endTime: string
    contactOutcome: string
    hoursWorked: string
    hoursCredited: string
    enforcementAction?: string
}

export default async function checkAppointmentDetails(
    page: Page,
    {
        projectName,
        startTime,
        endTime,
        contactOutcome,
        hoursWorked,
        hoursCredited,
        enforcementAction,
    }: CheckAppointmentDetailsOptions
): Promise<void> {
    const projectAppointmentRow = await getRowByContent(page, 'appointmentsTable', projectName)
    await projectAppointmentRow.getByRole('link', { name: 'view' }).click()

    await page.locator('span.float-start:has-text("View UPW Appointment")').waitFor()

    await expect(page.locator('div.row.mb-sm-2:has-text("Project:") > [id$=":outputText"]')).toContainText(projectName)
    await expect(page.locator('div.row.mb-sm-2:has-text("Start Time:") > [id$=":outputText"]')).toContainText(startTime)
    await expect(page.locator('div.row.mb-sm-2:has-text("End Time:") > [id$=":outputText"]')).toContainText(endTime)
    await expect(page.locator('div.row.mb-sm-2:has-text("Contact Outcome:") > [id$=":outputText"]')).toContainText(
        contactOutcome
    )
    await expect(page.locator('div.row.mb-sm-2:has-text("Hours Worked:") > [id$=":outputText"]')).toContainText(
        hoursWorked
    )
    await expect(page.locator('div.row.mb-sm-2:has-text("Hours Credited:") > [id$=":outputText"]')).toContainText(
        hoursCredited
    )

    if (enforcementAction) {
        await expect(
            page.locator('div.row.mb-sm-2:has-text("Enforcement Action:") > [id$=":outputText"]')
        ).toContainText(enforcementAction)
    } else {
        await expect(
            page.locator('div.row.mb-sm-2:has-text("Enforcement Action") > [id$=":outputText"]')
        ).not.toBeVisible()
    }
}
