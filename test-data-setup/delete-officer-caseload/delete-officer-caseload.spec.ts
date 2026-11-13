import { expect, test } from '@playwright/test'
import { login } from '../../steps/delius/login'
import { deleteCaseload, parseCaseloadExclusions } from '../../steps/delius/offender/delete-caseload'
import { selectOption } from '../../steps/delius/utils/inputs'
import { waitForAjax } from '../../steps/delius/utils/refresh'

const confirmation = 'DELETE TEST CASELOAD'

// This test is intended to be run manually against the Delius test environment to delete all records in a specific officer's caseload.
// It is not intended to be run as part of the normal test suite, and should only be run with caution and with the appropriate permissions.
// The test will delete all records in the selected officer's caseload, including events assigned to other officers, and cannot be undone.
// Use at your own risk.

// op run \
//   --account ministryofjustice.1password.eu \
//   --env-file=./.env.1password \
//   -- env \
//   ENV=test \
//   DELIUS_URL=https://ndelius.test.probation.service.justice.gov.uk \
// TEST_DIR=./test-data-setup \
//   CASELOAD_CLEANUP_OPTIONS='{"officer":"AutomatedTestUser, AutomatedTestUser (PS - PSO)","max_crns":100,"confirmation":"DELETE TEST CASELOAD"}' \
//   npx playwright test delete-officer-caseload --headed --workers=1 --reporter=line

test.describe.configure({ retries: 0 })

test('Delete the requested records in the selected officer test caseload', async ({ page }) => {
    test.setTimeout(30 * 90 * 1000) // 45 minutes
    test.info().annotations.push({
        type: 'warning',
        description: 'Deletes whole CRNs and all their events, including events assigned to other officers',
    })
    const rawOptions = process.env.CASELOAD_CLEANUP_OPTIONS
    if (!rawOptions) throw new Error('CASELOAD_CLEANUP_OPTIONS must contain the workflow inputs as JSON')
    const options: Record<string, unknown> = JSON.parse(rawOptions)
    if (options.confirmation !== confirmation) throw new Error(`Deletion requires confirmation: ${confirmation}`)
    if (options.officer === undefined || (typeof options.officer === 'string' && !options.officer.trim())) {
        options.officer = 'AutomatedTestUser, AutomatedTestUser (PS - PSO)'
    }
    const maxCrns = options.max_crns ?? 0
    if (typeof maxCrns !== 'number' || !Number.isSafeInteger(maxCrns) || maxCrns < 0) {
        throw new Error('max_crns must be a non-negative safe integer (0 deletes all selected records)')
    }
    const excludedCrns = parseCaseloadExclusions(options.exclude_crns)
    if (
        process.env.ENV !== 'test' ||
        new URL(process.env.DELIUS_URL ?? '').hostname !== 'ndelius.test.probation.service.justice.gov.uk'
    ) {
        throw new Error('Caseload deletion is only allowed against the Delius test environment')
    }

    await login(page)
    await page.getByRole('link', { name: 'Officer Diary', exact: true }).click()
    await page.getByRole('link', { name: 'Caseload', exact: true }).click()
    await expect(page.getByText('Caseload Diary', { exact: true })).toBeVisible()

    for (const [key, id] of [
        ['provider', 'trust'],
        ['pdu', 'cluster'],
        ['local_admin_unit', 'ldu'],
        ['team', 'team'],
        ['officer', 'officer'],
        ['all_teams', 'allTeams'],
        ['list_requirements', 'allComponents'],
        ['filter', 'filter'],
    ] as const) {
        const value = options[key]
        if (value === undefined) continue
        if (typeof value !== 'string') throw new Error(`Invalid ${key}: expected a string`)
        if (!value.trim()) continue
        if ((key === 'all_teams' || key === 'list_requirements') && value === 'Default') continue
        const selector = `[id="${id}:selectOneMenu"]`
        const field = page.locator(selector)
        let selectedLabel = value.trim()
        if (key === 'officer') {
            const labels = await field.locator('option').allTextContents()
            const exact = labels.filter(text => text.trim() === selectedLabel)
            const matches = exact.length
                ? exact
                : labels.filter(text => text.toLowerCase().includes(selectedLabel.toLowerCase()))
            if (matches.length !== 1)
                throw new Error(
                    `Officer "${selectedLabel}" matches ${matches.length} options; use the full dropdown name`
                )
            selectedLabel = matches[0].trim()
        }
        await selectOption(page, selector, selectedLabel)
    }

    const officer = page.locator('[id="officer:selectOneMenu"]')
    const selectedOfficer = (await officer.locator('option:checked').textContent())?.trim()
    if (!selectedOfficer || /all officers|please select|not selected/i.test(selectedOfficer)) {
        throw new Error('Select a specific officer before deleting a caseload')
    }
    console.log(`Selected officer: ${selectedOfficer}`)
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    await waitForAjax(page)
    await deleteCaseload(page, maxCrns, excludedCrns)
})
