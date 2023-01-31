import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh.js'
import { WorkforceDateFormat } from './utils.js'
import { Allocation, Team } from '../../test-data/test-data.js'

export const viewAllocation = async (page: Page, crn: string) => {
    const matchingRow = page.locator('tr', { hasText: crn })
    await refreshUntil(page, () => expect(matchingRow).not.toHaveCount(0))
    await expect(matchingRow).toContainText(WorkforceDateFormat(new Date()))
    await matchingRow.locator(`[href*=${crn}]`).click()
    await expect(page.locator('.govuk-caption-xl', { hasText: crn })).toHaveText(`CRN: ${crn}`)
}

export const allocateCase = async (page: Page, crn: string, allocation: Allocation) => {
    await page.getByRole('button', { name: 'View unallocated cases' }).click()
    await expect(page).toHaveTitle(/.*Unallocated cases.*/)
    await selectTeam(page, allocation.team)
    await viewAllocation(page, crn)
    // Navigate to allocation page
    await page.locator('a', { hasText: 'Continue' }).click()
    await expect(page).toHaveTitle(/.*Choose practitioner.*/)

    // Allocate to team/staff
    await page
        .getByRole('row', { name: `${allocation.staff.firstName} ${allocation.staff.lastName}` })
        .getByRole('radio')
        .check()
    await page.locator('button', { hasText: 'Continue' }).click()

    // Confirm allocation
    await expect(page).toHaveTitle(/.*Allocate to practitioner.*/)
    await page.locator('a', { hasText: 'Continue' }).click()

    // Review and submit allocation
    await expect(page).toHaveTitle(/.*Review allocation instructions.*/)
    await page.fill('#instructions', `Allocation for ${crn} completed by hmpps-end-to-end-tests`)
    await page.locator('button', { hasText: 'Allocate Case' }).click()
    await page.locator('div.govuk-panel--confirmation >> h1.govuk-panel__title', { hasText: 'Allocation complete' })
}

const selectTeam = async (page: Page, team: Team) => {
    await page
        .getByRole('combobox', { name: 'Probation delivery unit (PDU)' })
        .selectOption({ label: team.probationDeliveryUnit })
    await page
        .getByRole('combobox', { name: 'Local delivery unit (LDU)' })
        .selectOption({ label: team.localDeliveryUnit })
    await page.getByRole('combobox', { name: 'Team' }).selectOption({ label: team.name.replace(/^NPS - /, '') })
    await page.getByRole('button', { name: 'Save and view selection' }).click()
    await expect(page).toHaveTitle(/.*Unallocated cases.*/)
}
