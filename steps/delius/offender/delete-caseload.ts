import { expect, type Page } from '@playwright/test'
import { deleteOffender } from './delete-offender'
import { selectOption } from '../utils/inputs'
import { waitForAjax } from '../utils/refresh'

const filterIds = ['trust', 'cluster', 'ldu', 'team', 'officer', 'allTeams', 'allComponents', 'filter']

async function individualCount(page: Page): Promise<number> {
    const text = await page.getByText(/Number of Individuals:/).innerText()
    const match = text.match(/Number of Individuals:\s*([\d,]+)/)
    if (!match) throw new Error('Could not read the caseload individual count')
    const count = Number(match[1].replaceAll(',', ''))
    if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Invalid caseload individual count: ${match[1]}`)
    return count
}

export async function deleteCaseload(
    page: Page,
    maxCrns: number,
    removePerson: typeof deleteOffender = deleteOffender
): Promise<void> {
    if (!Number.isSafeInteger(maxCrns) || maxCrns < 0)
        throw new Error('The CRN limit must be a non-negative safe integer')
    const diaryUrl = page.url()
    const filters: { selector: string; label: string }[] = []
    for (const id of filterIds) {
        const selector = `[id="${id}:selectOneMenu"]`
        const label = await page.locator(selector).locator('option:checked').textContent()
        if (!label) throw new Error(`Could not read selected caseload filter: ${id}`)
        filters.push({ selector, label: label.trim() })
    }
    const available = await individualCount(page)
    const target = maxCrns === 0 ? available : Math.min(maxCrns, available)
    console.log(`Caseload contains ${available} individuals; deleting up to ${target} CRNs`)
    const deleted = new Set<string>()
    for (let index = 0; index < target; index++) {
        if ((await individualCount(page)) === 0) {
            console.log('Selected caseload is now empty')
            break
        }
        await page
            .getByRole('link', { name: /^View Person(?:\s+\d+)?$/ })
            .first()
            .click()
        await expect(page.getByRole('heading', { name: 'Case Summary', exact: true })).toBeVisible()
        const crn = (await page.locator('//*[contains(@title, "Case Reference Number")]').first().textContent())?.trim()
        if (!crn || !/^[A-Z]\d{6}$/.test(crn)) throw new Error('Could not identify a valid CRN from the person page')
        if (deleted.has(crn)) throw new Error(`Deleted CRN ${crn} is still in the caseload; stopping deletion`)
        await removePerson(page, crn)
        deleted.add(crn)
        console.log(`Deleted CRN: ${crn} (${deleted.size}/${target})`)
        if (deleted.size === target) break

        // Re-search rather than using browser history, which can restore rows for deleted records.
        await page.goto(diaryUrl)
        await expect(page.getByText('Caseload Diary', { exact: true })).toBeVisible()
        for (const { selector, label } of filters) {
            await selectOption(page, selector, label)
        }
        await page.getByRole('button', { name: 'Search', exact: true }).click()
        await waitForAjax(page)
    }
    console.log(`Successfully deleted ${deleted.size} CRNs: ${[...deleted].join(', ')}`)
}
