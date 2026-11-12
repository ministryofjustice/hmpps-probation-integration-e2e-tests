import { expect, type Page } from '@playwright/test'
import { deleteOffender, OffenderDeletionExceptionError, OffenderDeletionRejectedError } from './delete-offender'
import { selectOption } from '../utils/inputs'
import { waitForAjax } from '../utils/refresh'

const filterIds = ['trust', 'cluster', 'ldu', 'team', 'officer', 'allTeams', 'allComponents', 'filter']
const protectedCrns = [
    'X693742',
    'X698315',
    'X600508',
    'X738925',
    'X757129',
    'Y088366',
    'Y086759',
    'Y086627',
    'Y086007',
]

export function parseCaseloadExclusions(value: unknown = ''): Set<string> {
    if (typeof value !== 'string') throw new Error('exclude_crns must be a comma-separated string of CRNs')
    const crns = value
        .split(',')
        .map(crn => crn.trim().toUpperCase())
        .filter(Boolean)
    for (const crn of crns) {
        if (!/^[A-Z]\d{6}$/.test(crn)) throw new Error(`Invalid excluded CRN: ${crn}`)
    }
    return new Set([...protectedCrns, ...crns])
}

async function individualCount(page: Page): Promise<number> {
    if (await page.getByText('No caseload items found.', { exact: true }).isVisible()) return 0
    const text = await page.getByText(/Number of Individuals:/).innerText()
    const match = text.match(/Number of Individuals:\s*([\d,]+)/)
    if (!match) throw new Error('Could not read the caseload individual count')
    const count = Number(match[1].replaceAll(',', ''))
    if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Invalid caseload individual count: ${match[1]}`)
    return count
}

async function nextCaseloadPage(page: Page): Promise<boolean> {
    const paginator = page.locator('[id$="resultListPaginator:paginationArea"]')
    // Delius uses a page dropdown instead of Next when row numbers are enabled.
    const dropdown = paginator.locator('select')
    if (await dropdown.count()) {
        const values = await dropdown
            .locator('option')
            .evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))
        const index = values.indexOf(await dropdown.inputValue())
        if (index < 0) throw new Error('Could not identify the current caseload page')
        if (index === values.length - 1) return false
        await dropdown.selectOption(values[index + 1])
    } else {
        const next = paginator.getByRole('link', { name: 'Next', exact: true })
        if (!(await next.isVisible())) return false
        if (
            (await next.getAttribute('aria-disabled')) === 'true' ||
            (await next.locator('..').getAttribute('class'))?.split(/\s+/).includes('disabled')
        )
            return false
        await next.click()
    }
    await waitForAjax(page)
    return true
}

async function assertNameAbsent(page: Page, name: string): Promise<void> {
    if ((await individualCount(page)) === 0) return
    const table = page.locator('[id="componentTable"], [id$=":componentTable"]')
    await expect(table).toBeVisible()
    const names = await table.locator('tbody tr td:nth-child(2)').allTextContents()
    expect(
        names.map(value => value.trim()),
        `${name} must no longer appear on the first page of the selected caseload`
    ).not.toContain(name)
}

async function accessiblePerson(
    page: Page,
    exclusions: ReadonlySet<string>
): Promise<{ crn: string; name: string } | undefined> {
    const table = page.locator('[id="componentTable"], [id$=":componentTable"]')
    const paginator = page.locator('[id$="resultListPaginator:paginationArea"]')
    const visited = new Set<string>()
    while (true) {
        await expect(table).toBeVisible()
        const state = `${await table.innerHTML()}|${(await paginator.count()) ? await paginator.innerHTML() : ''}`
        if (visited.has(state)) throw new Error('Caseload pagination repeated a page; stopping deletion')
        visited.add(state)
        const rows = table.locator('tbody tr')
        const restricted = rows.filter({ hasText: /\*/ })
        const restrictedCount = await restricted.count()
        if (restrictedCount) console.log(`Skipping ${restrictedCount} restricted (*) caseload rows on this page`)
        const people = rows.filter({ hasNotText: /\*/ }).getByRole('link', { name: /^View Person(?:\s+\d+)?$/ })
        const peopleCount = await people.count()
        for (let index = 0; index < peopleCount; index++) {
            const name = (
                await people.nth(index).locator('xpath=ancestor::tr[1]').locator('td').nth(1).innerText()
            ).trim()
            if (!name) throw new Error('Could not read the person name from the caseload row')
            await people.nth(index).click()
            await expect(page.locator('h1').filter({ hasText: 'Personal Details' })).toBeVisible()
            await page.getByRole('link', { name: 'Case Summary' }).click()
            await expect(page.getByRole('heading', { name: 'Case Summary', exact: true })).toBeVisible()
            const crn = (
                await page.locator('//*[contains(@title, "Case Reference Number")]').first().textContent()
            )?.trim()
            if (!crn || !/^[A-Z]\d{6}$/.test(crn))
                throw new Error('Could not identify a valid CRN from the person page')
            if (!exclusions.has(crn)) return { crn, name }
            console.log(`Skipping excluded CRN: ${crn}`)
            // Return directly to this results page, not the intervening Case Summary.
            await page.goBack()
            await expect(page.locator('h1').filter({ hasText: 'Personal Details' })).toBeVisible()
            await page.goBack()
            await expect(table).toBeVisible()
            if (`${await table.innerHTML()}|${(await paginator.count()) ? await paginator.innerHTML() : ''}` !== state)
                throw new Error('Caseload results changed while skipping an excluded CRN; stopping deletion')
        }

        if (!(await nextCaseloadPage(page))) return undefined
    }
}

export async function deleteCaseload(
    page: Page,
    maxCrns: number,
    excludedCrns: ReadonlySet<string> = new Set(),
    removePerson: typeof deleteOffender = deleteOffender
): Promise<void> {
    if (!Number.isSafeInteger(maxCrns) || maxCrns < 0)
        throw new Error('The CRN limit must be a non-negative safe integer')
    const diaryUrl = page.url()
    const exclusions = new Set([...protectedCrns, ...excludedCrns])
    console.log(`Excluded CRNs (including permanent protections): ${[...exclusions].join(', ')}`)
    const filters: { selector: string; label: string }[] = []
    for (const id of filterIds) {
        const selector = `[id="${id}:selectOneMenu"]`
        const label = await page.locator(selector).locator('option:checked').textContent()
        if (!label) throw new Error(`Could not read selected caseload filter: ${id}`)
        filters.push({ selector, label: label.trim() })
    }
    const available = await individualCount(page)
    const target = maxCrns === 0 ? available : Math.min(maxCrns, available)
    console.log(`Caseload contains ${available} individuals: deleting up to ${target} CRNs`)
    const deleted = new Set<string>()
    const removedFromCaseload = new Set<string>()
    const unknownOutcomes = new Set<string>()
    const refreshCaseload = async () => {
        // Re-search rather than restoring stale rows from browser history.
        await page.goto(diaryUrl)
        await expect(page.getByText('Caseload Diary', { exact: true })).toBeVisible()
        for (const { selector, label } of filters) {
            await selectOption(page, selector, label)
        }
        await page.getByRole('button', { name: 'Search', exact: true }).click()
        await waitForAjax(page)
    }
    try {
        while (deleted.size + removedFromCaseload.size < target) {
            if ((await individualCount(page)) === 0) {
                console.log('Selected caseload is now empty')
                break
            }
            const person = await accessiblePerson(page, exclusions)
            if (!person) {
                console.log(
                    'No eligible people remain in the selected caseload; restricted and excluded cases were skipped'
                )
                break
            }
            const { crn, name } = person
            if (deleted.has(crn) || removedFromCaseload.has(crn))
                throw new Error(`Processed CRN ${crn} is still in the caseload; stopping deletion`)
            try {
                await removePerson(page, crn)
                deleted.add(crn)
                console.log(`Deleted CRN: ${crn} (${deleted.size + removedFromCaseload.size}/${target})`)
            } catch (error) {
                if (error instanceof OffenderDeletionExceptionError) {
                    unknownOutcomes.add(crn)
                    exclusions.add(crn)
                    console.warn(
                        `${error.message}; skipping this CRN for the rest of this run and returning to caseload`
                    )
                } else if (error instanceof OffenderDeletionRejectedError) {
                    console.warn(`${error.message}; checking whether ${name} was removed from the caseload`)
                    await refreshCaseload()
                    await assertNameAbsent(page, name)
                    removedFromCaseload.add(crn)
                    console.warn(
                        `Removed from caseload, CRN retained: ${crn} (${name}) (${deleted.size + removedFromCaseload.size}/${target})`
                    )
                } else {
                    throw error
                }
            }
            if (deleted.size + removedFromCaseload.size === target) break
            await refreshCaseload()
        }
    } finally {
        console.log(`Successfully deleted ${deleted.size} CRNs: ${[...deleted].join(', ')}`)
        console.log(
            `Removed from caseload but CRN retained: ${removedFromCaseload.size}: ${[...removedFromCaseload].join(', ')}`
        )
        if (unknownOutcomes.size) {
            console.warn(`Deletion outcome unknown after Delius exceptions: ${[...unknownOutcomes].join(', ')}`)
        }
    }
}
