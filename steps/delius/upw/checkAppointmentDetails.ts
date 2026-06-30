import { expect, Page } from '@playwright/test'
import { waitForAjax } from '../utils/refresh'
import { getRowByContent, getRowCellsByContent } from '../utils/table'

export type CheckAppointmentOptions = {
    teamProvider: string
    teamName: string
    projectName: string
    popCrn: string
    popName: string
    startTime: string
    endTime: string
    penalty?: string
    outcome: string
    enforcementAction?: string
    hoursCredited?: string
    outStanding?: string
}

export async function checkAppointmentOnDelius(
    page: Page,
    checkAppointmentOptions: CheckAppointmentOptions
): Promise<void> {
    const {
        teamProvider,
        teamName,
        projectName,
        popCrn,
        popName,
        startTime,
        endTime,
        penalty,
        outcome,
        enforcementAction,
        hoursCredited,
        outStanding,
    } = checkAppointmentOptions

    await page.getByRole('combobox', { name: 'Provider:' }).selectOption(teamProvider)
    await page.getByRole('combobox', { name: 'Team:' }).selectOption(teamName)

    await page.getByRole('button', { name: 'Search' }).click()
    await waitForAjax(page)
    await page.waitForSelector('h2:text-is("Project List")')

    const row = await getRowByContent(page, 'searchResultsTable', projectName)

    await row.getByRole('link', { name: 'manage' }).click()
    await page.waitForSelector('h2:text-is("Allocated To Attend")')

    const cells = await getRowCellsByContent(page, 'allocatedOffendersTable', popCrn)

    expect(cells[0]).toContain(popCrn)
    expect(cells[1]).toBe(popName)
    expect(cells[2]).toBe(startTime)
    expect(cells[3]).toBe(endTime)

    if (penalty) {
        expect(cells[4]).toBe(penalty)
    }

    expect(cells[5]).toBe(outcome)

    if (enforcementAction) {
        expect(cells[6]).toBe(enforcementAction)
    }

    if (hoursCredited) {
        expect(cells[7]).toBe(hoursCredited)
    }

    if (outStanding) {
        expect(cells[8]).toBe(outStanding)
    }
}
