import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'
import { Allocation, Optional } from '../../../test-data/test-data'

export async function internalTransfer(
    page: Page,
    {
        crn,
        allocation,
        reason = 'Initial Allocation',
    }: {
        crn: string
        allocation?: Optional<Allocation>
        reason?: string
    }
) {
    await findOffenderByCRN(page, crn)
    await page.locator('input', { hasText: 'Transfers' }).click({ timeout: 5000 })
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
    await selectOption(page, '#Trust\\:selectOneMenu', allocation?.team?.provider)
    await selectOption(page, '#Team\\:selectOneMenu', allocation?.team?.name)
    const selectedStaff = await selectOption(page, '#Staff\\:selectOneMenu', allocation?.staff?.name)

    const options = await page.locator('#offenderTransferRequestTable').locator('select')

    const count = await options.count()
    for (let i = 0; i < count; i++) {
        await options.nth(i).selectOption({ label: reason })
    }

    await page.locator('input', { hasText: 'Transfer' }).click()
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)

    return selectedStaff
}
