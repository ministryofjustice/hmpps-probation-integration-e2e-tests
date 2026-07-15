import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'
import { Allocation, Optional } from '../../../test-data/test-data'
import { waitForAjax } from '../utils/refresh'

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

    const count = await page.locator('#offenderTransferRequestTable select').count()
    for (let i = 0; i < count; i++) {
        await selectOption(page, `:nth-match(#offenderTransferRequestTable select, ${i + 1})`, reason)
    }

    await page.locator('input', { hasText: 'Transfer' }).click()
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)

    return selectedStaff
}

async function selectProviderTeamUser(page: Page, provider: string, team: string, displayName: string) {
    await selectOption(page, '#Trust\\:selectOneMenu', provider)
    await selectOption(page, '#Team\\:selectOneMenu', team)
    await selectOption(page, '#Staff\\:selectOneMenu', displayName)
}
export async function transferToDeliusUser(
    page: Page,
    {
        crn,
        provider,
        team,
        displayName,
        reason = 'Initial Allocation',
    }: {
        crn: string
        provider: string
        team: string
        displayName: string
        reason?: string
    }
) {
    await findOffenderByCRN(page, crn)
    await page.locator('input', { hasText: 'Transfers' }).click({ timeout: 5000 })

    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
    await waitForAjax(page)
    await selectProviderTeamUser(page, provider, team, displayName)

    const count = await page.locator('#offenderTransferRequestTable select').count()
    for (let i = 0; i < count; i++) {
        await selectOption(page, `:nth-match(#offenderTransferRequestTable select, ${i + 1})`, reason)
    }
    await page.locator('input', { hasText: 'Transfer' }).click()
    await waitForAjax(page)

    await page
        .locator('#offenderTransferRequestTable tbody tr')
        .filter({ hasText: 'Person' })
        .filter({ hasText: displayName })
        .waitFor()

    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
    console.log(`Case has been allocated to user.`)
}
