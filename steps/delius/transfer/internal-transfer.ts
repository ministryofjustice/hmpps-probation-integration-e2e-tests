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
    await page.locator('input', { hasText: 'Transfers' }).click({ timeout: 5000 })

    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
    // await waitForAjax(page)
    // await selectOption(page, '#Trust\\:selectOneMenu', provider)
    await waitForAjax(page)
    await selectOption(page, '#Team\\:selectOneMenu', team)
    console.log('selected option is:')
    console.log(page.locator('#Team\\:selectOneMenu').inputValue())
    await waitForAjax(page)
    if (await page.locator('.prompt.prompt-error').isVisible()) {
        await selectOption(page, '#Team\\:selectOneMenu', team)
    }
    console.log("retrying team select: selected option is:")
    console.log(page.locator('#Team\\:selectOneMenu').inputValue())
    await waitForAjax(page)


    await selectOption(
        page,
        '#Staff\\:selectOneMenu',
        undefined,
        s => s.toLowerCase().includes(firstName.toLowerCase()) && s.toLowerCase().includes(lastName.toLowerCase())
    )

    console.log('selected staff option is:')
    console.log(page.locator('#Staff\\:selectOneMenu').inputValue())

    await waitForAjax(page)
    if (await page.locator('.prompt.prompt-error').isVisible()) {
        await selectOption(
            page,
            '#Staff\\:selectOneMenu',
            undefined,
            s => s.toLowerCase().includes(firstName.toLowerCase()) && s.toLowerCase().includes(lastName.toLowerCase())
        )
        console.log('retrying staff select: selected staff option is:')
        console.log(page.locator('#Staff\\:selectOneMenu').inputValue())
    }

    const count = await page.locator('#offenderTransferRequestTable select').count()
    for (let i = 0; i < count; i++) {
        await selectOption(page, `:nth-match(#offenderTransferRequestTable select, ${i + 1})`, reason)
    }
    await page.locator('input', { hasText: 'Transfer' }).click()
    await expect(page.locator('.prompt.prompt-error')).toHaveCount(0)
    await page
        .locator('tr')
        .filter({ hasText: `Person` })
        .filter({ hasText: firstName })
        .filter({ hasText: lastName })
        .waitFor({ timeout: 10000 })

    await expect(page).toHaveTitle(/Consolidated Transfer Request/)
    console.log(`Case has been allocated to user.`)
}
