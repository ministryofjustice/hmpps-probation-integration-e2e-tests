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

    const count = await page.locator('#offenderTransferRequestTable select').count()
    for (let i = 0; i < count; i++) {
        await selectOption(page, `:nth-match(#offenderTransferRequestTable select, ${i + 1})`, reason)
    }

    await page.locator('input', { hasText: 'Transfer' }).click()
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)

    return selectedStaff
}

export async function transferToDeliusUser(
    page: Page,
    {
        crn,
        provider,
        team,
        firstName,
        lastName,
        reason = 'Initial Allocation',
    }: {
        crn: string
        provider: string
        team: string
        firstName: string
        lastName: string
        reason?: string
    }
) {
    await findOffenderByCRN(page, crn)
    console.log('found offender')
    await page.locator('input', { hasText: 'Transfers' }).click({ timeout: 5000 })

    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
    console.log('on transfer request page')
    await selectOption(page, '#Trust\\:selectOneMenu', provider)
    console.log(`selected ${provider}`)
    await selectOption(page, '#Team\\:selectOneMenu', team)
    console.log(`selected ${team}`)
    await selectOption(
        page,
        '#Staff\\:selectOneMenu',
        undefined,
        s => s.toLowerCase().includes(firstName.toLowerCase()) && s.toLowerCase().includes(lastName.toLowerCase())
    )

    console.log(`selected ${firstName}`)

    const count = await page.locator('#offenderTransferRequestTable select').count()
    for (let i = 0; i < count; i++) {
        await selectOption(page, `:nth-match(#offenderTransferRequestTable select, ${i + 1})`, reason)
    }

    await page.locator('input', { hasText: 'Transfer' }).click()
    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
}
