import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh'
import { WorkforceDateFormat } from './utils'
import { Allocation, Team } from '../../test-data/test-data'
import { Tomorrow } from '../delius/utils/date-time'

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
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle(/Choose practitioner/)

    // Allocate to team/staff
    await page
        .locator('tr', { hasText: `${allocation.staff.firstName} ${allocation.staff.lastName}` })
        .getByRole('radio')
        .check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm allocation
    await expect(page).toHaveTitle(/Allocate to practitioner/)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Explain the reason for allocation to this Practitioner
    await refreshUntil(page, () => expect(page).toHaveTitle(/Review allocation notes/))
    await page.fill(
        '#instructions',
        `${allocation.staff.firstName} ${allocation.staff.lastName} is allocated on case with ${crn}. Allocation for ${crn} completed by hmpps-end-to-end-tests`
    )
    await page.click('#isSensitive')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Save Notes as an oversight contact and allocate case
    await expect(page).toHaveURL(/spo-oversight-contact-option$/)
    await page.getByRole('button', { name: 'Save my notes without editing' }).click()
}

export const selectTeam = async (page: Page, team: Team) => {
    await page
        .getByRole('combobox', { name: 'Probation delivery unit (PDU)' })
        .selectOption({ label: team.probationDeliveryUnit })
    await page.getByRole('combobox', { name: 'Local admin unit (LAU)' }).selectOption({ label: team.localDeliveryUnit })
    await page.locator('form >> select[name="team"]').first().selectOption({ label: 'NPS - Wrexham - Team 1' })
    await page.getByRole('button', { name: 'Save and view selection' }).click()
    await refreshUntil(page, () => expect(page).toHaveTitle(/.*Unallocated cases.*/))
    await expect(page).toHaveTitle(/.*Unallocated cases.*/)
}
