import { expect, type Page } from '@playwright/test'
import { DateTime } from 'luxon'

export const addDutyToReferDetails = async (page: Page, crn: string) => {
    const submissionDate = DateTime.now().setZone('Europe/London').minus({ days: 1 })
    const localAuthority = 'Aberdeen City'
    const reference = `DTR-${crn}`
    const note = `Duty to Refer integration test for ${crn}`

    await page.getByRole('link', { name: 'Add referral details', exact: true }).and(page.locator(`a[href="/cases/${crn}/dtr/submission"]`)).click()
    await expect(
        page.getByRole('heading', { name: 'Add Duty to Refer (DTR) referral details', exact: true })
    ).toBeVisible()

    const dateFields = page.getByRole('group', { name: 'When was the DTR submitted?' })
    await dateFields.getByRole('textbox', { name: 'Day', exact: true }).fill(submissionDate.day.toString())
    await dateFields.getByRole('textbox', { name: 'Month', exact: true }).fill(submissionDate.month.toString())
    await dateFields.getByRole('textbox', { name: 'Year', exact: true }).fill(submissionDate.year.toString())
    await page.getByRole('combobox', { name: 'What local authority was the DTR submitted to?' }).fill(localAuthority)
    await page.getByRole('option', { name: localAuthority, exact: true }).click()
    await page.getByRole('textbox', { name: 'Reference number (optional)', exact: true }).fill(reference)
    await page.getByRole('textbox', { name: 'Notes (optional)', exact: true }).fill(note)
    await page.getByRole('button', { name: 'Save and continue', exact: true }).click()

    await expect(page.getByRole('heading', { name: 'DTR referral details added', exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'View referral', exact: true }).and(page.locator(`a[href^="/cases/${crn}/dtr/"]`)).click()
    await expect(page.getByRole('heading', { name: 'Duty to Refer (DTR)', exact: true })).toBeVisible()
    const details = page.locator('.govuk-summary-list').filter({ hasText: reference })
    await expect(details).toContainText('Submitted')
    await expect(details).toContainText(localAuthority)
    await expect(details).toContainText(note)
    await expect(details).toContainText(submissionDate.toFormat('d MMMM yyyy'))
    return page.url()
}

export const acceptDutyToRefer = async (page: Page) => {
    const note = 'Local authority accepted the Duty to Refer referral'
    await page.getByRole('button', { name: 'Add outcome', exact: true }).click()
    await page.getByRole('radio', { name: 'Yes, it was accepted on prevention and relief duty', exact: true }).check()
    await page.getByRole('textbox', { name: 'Notes (optional)', exact: true }).fill(note)
    await page.getByRole('button', { name: 'Save and continue', exact: true }).click()
    await expect(
        page
            .getByRole('alert', { name: 'Success' })
            .getByRole('heading', { name: 'Outcome details added', exact: true })
    ).toBeVisible()
    const outcome = page.locator('.govuk-summary-list').filter({ hasText: note })
    await expect(outcome).toContainText('Accepted')
}
