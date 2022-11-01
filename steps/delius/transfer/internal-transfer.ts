import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findOffenderByCRN } from '../offender/find-offender.js'

export async function internalTransfer(
    page: Page,
    {
        crn,
        allocation,
        reason = 'Initial Allocation',
    }: {
        crn: string
        allocation?: {
            providerName?: string
            teamName?: string
            staffName?: string
        }
        reason?: string
    }
) {
    await findOffenderByCRN(page, crn)
    await page.locator('input', { hasText: 'Transfers' }).click()
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)

    await selectOption(page, '#offenderTransferRequestListForm\\:Trust', allocation.providerName)
    await selectOption(page, '#offenderTransferRequestListForm\\:Team', allocation.teamName)
    await selectOption(page, '#offenderTransferRequestListForm\\:Staff', allocation.staffName)

    const options = await page
        .locator('#offenderTransferRequestListForm\\:offenderTransferRequestTable')
        .locator('select')

    const count = await options.count()
    for (let i = 0; i < count; i++) {
        await options.nth(i).selectOption({ label: reason })
    }

    await page.locator('input', { hasText: 'Transfer' }).click()
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
}
