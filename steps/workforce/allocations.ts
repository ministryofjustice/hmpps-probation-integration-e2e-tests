import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh.js'
import { WorkforceDateFormat } from './utils.js'
import { Allocation } from '../../test-data/test-data.js'

export const viewAllocation = async (page: Page, crn: string) => {
    await page.locator('a[data-qa-link="N03F01"]', { hasText: 'View unallocated cases' }).click()
    await expect(page).toHaveTitle(/.*Unallocated cases.*/)
    const matchingRow = page.locator('tr', { hasText: crn })
    await refreshUntil(page, () => expect(matchingRow).not.toHaveCount(0))
    await expect(matchingRow).toContainText(WorkforceDateFormat(new Date()))
    // await matchingRow.locator('a', { hasText: 'Review case' }).click()
    await matchingRow.locator(`[href*=${crn}]`).click()
    await expect(page.locator('.govuk-caption-xl', { hasText: crn })).toHaveText(`CRN: ${crn}`)
}

export const allocateCase = async (page: Page, crn: string, allocation: Allocation) => {
    await selectTeam(page)
    await viewAllocation(page, crn)
    // Navigate to allocation page
    await page.locator('a', { hasText: 'Continue' }).click()
    await expect(page).toHaveTitle(/.*Choose practitioner.*/)

    // Allocate to team/staff
    await page
        .locator('tr', { hasText: `${allocation.staff.firstName} ${allocation.staff.lastName}` })
        .locator('.govuk-radios__input')
        .click()
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

const selectTeam = async (page: Page) => {
    const selectRequired = (await page.locator('h1', { hasText: 'Select your teams' }).count()) > 0
    if (selectRequired) {
        await page.locator('label', { hasText: ' Wrexham - Team 1 ' }).click()
        await page.locator('button', { hasText: 'Continue' }).click()
    }
}
