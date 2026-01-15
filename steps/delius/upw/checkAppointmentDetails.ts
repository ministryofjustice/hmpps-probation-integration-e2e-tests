import { expect, Locator, Page } from '@playwright/test'
import { waitForAjax } from '../utils/refresh'

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

async function clickNextButton(page: Page) {
    const nextButtonSelector = 'a.page-link[title="Next"]:not(.disabled)'
    await page.waitForSelector(nextButtonSelector, { state: 'visible' })

    await page.click(nextButtonSelector)
    await waitForAjax(page)
    await page.waitForSelector('#searchResultsTable tbody')

    return true
}

async function getRowByContent(page: Page, content: string): Promise<Locator> {
    const row = page.locator(`#searchResultsTable tbody tr:has-text("${content}")`).first()
    if (await row.isVisible().catch(() => false)) {
        return row
    }

    const nextButton = page.locator('a.page-link[title="Next"]:not(.disabled)')

    if ((await nextButton.count()) > 0) {
        await clickNextButton(page)
        return getRowByContent(page, content)
    }
    throw new Error(`Row with content "${content}" not found`)
}

async function getCellContents(row: Locator): Promise<string[]> {
    const cellElements = await row.locator('td').all()

    return await Promise.all(
        cellElements.map(async td => {
            const text = await td.innerText()
            return text.trim()
        })
    )
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

    const row = await getRowByContent(page, projectName)

    await row.getByRole('link', { name: 'manage' }).click()
    await page.waitForSelector('h2:text-is("Allocated To Attend")')

    const rowByCrn = page
        .locator('#allocatedOffendersTable tbody tr')
        .filter({ has: page.locator(`td:first-child:text-is("${popCrn}")`) })

    const cells = await getCellContents(rowByCrn)

    expect(cells[0]).toBe(popCrn)
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
