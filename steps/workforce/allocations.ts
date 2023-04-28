import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh.js'
import { WorkforceDateFormat } from './utils.js'
import { Allocation, Team } from '../../test-data/test-data.js'
import { Tomorrow } from '../delius/utils/date-time.js'

export const viewAllocation = async (page: Page, crn: string) => {
    const matchingRow = page.locator('tr', { hasText: crn })
    await refreshUntil(page, () => expect(matchingRow).not.toHaveCount(0))
    await expect(matchingRow).toContainText(WorkforceDateFormat(Tomorrow))
    await matchingRow.locator(`[href*=${crn}]`).click()
    await expect(page.locator('.govuk-caption-xl', { hasText: crn })).toHaveText(`CRN: ${crn}`)
}

export const allocateCase = async (page: Page, crn: string, allocation: Allocation) => {
    await page.getByRole('button', { name: 'View unallocated cases' }).click()
    await refreshUntil(page, () => expect(page).toHaveTitle(/.*Unallocated cases.*/))
    await expect(page).toHaveTitle(/.*Unallocated cases.*/)
    await selectTeam(page, allocation.team)
    await viewAllocation(page, crn)
    // Navigate to allocation page
    await page.locator('a', { hasText: 'Continue' }).click()
    await expect(page).toHaveTitle(/.*Choose practitioner.*/)

    // Allocate to team/staff
    await page
        .locator('tr', { hasText: `${allocation.staff.firstName} ${allocation.staff.lastName}` })
        .getByRole('radio')
        .check()
    await page.locator('button', { hasText: 'Continue' }).click()

    // Confirm allocation
    await expect(page).toHaveTitle(/.*Choose practitioner | Manage a workforce.*/)
    await page.locator('a', { hasText: 'Continue' }).click()

    // Explain the reason for allocation to this Practitioner
    await expect(page).toHaveTitle(/.*Explain your decision | Manage a workforce.*/)
    await page.fill(
        '#evidenceText',
        `${allocation.staff.firstName} ${allocation.staff.lastName} is allocated on case with ${crn} has the necessary specialized knowledge, skills, experience, and training to manage it.`
    )
    await page.click('#isSensitive')
    await page.locator('button', { hasText: 'Continue' }).click()

    // Review and submit allocation
    await expect(page).toHaveTitle(/.*Review allocation instructions.*/)
    await page.fill('#instructions', `Allocation for ${crn} completed by hmpps-end-to-end-tests`)
    await page.locator('button', { hasText: 'Allocate Case' }).click()
    await page.locator('div.govuk-panel--confirmation >> h1.govuk-panel__title', { hasText: 'Allocation complete' })
    await refreshUntil(page, () => expect(page).toHaveTitle(/.*Case allocated | Manage a workforce.*/))
}

export const selectTeam = async (page: Page, team: Team) => {
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
