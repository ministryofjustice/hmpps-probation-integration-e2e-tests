import { expect, Page } from '@playwright/test'
import { format } from 'date-fns'

export async function findProgrammeAndMakeReferral(page: Page, nomisId: string) {
    await page.getByRole('link', { name: 'Find a programme and make a referral' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Find an Accredited Programme/)
    await page.getByRole('link', { name: 'Becoming New Me Plus: sexual offence' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Becoming New Me Plus: sexual offence/)
    await page.getByRole('link', { name: 'Whatton (HMP)' }).click()
    await expect(page).toHaveTitle(
        /HMPPS Accredited Programmes - Becoming New Me Plus: sexual offence, Whatton \(HMP\)/
    )
    await page.getByRole('button', { name: /Make a referral/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Make a referral/)
    await page.getByRole('button', { name: 'Start now' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Enter the person's identifier/)
    await page.getByLabel("Enter the prison number. We'll import their details into your application.").fill(nomisId)
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Confirm personal details/)
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Make a referral/)
    await page.getByRole('link', { name: 'Review Accredited Programme history' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Accredited Programme history/)
    await page.getByRole('button', { name: /Return to tasklist/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Make a referral/)
    await expect(page.locator('[data-testid="programme-history-tag"]')).toContainText('Completed')
    await page.getByRole('link', { name: 'Confirm the OASys information' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Confirm the OASys information/)
    await page.getByRole('checkbox', { name: /I confirm that the OASys information is up to date./ }).click()
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Make a referral/)
    await expect(page.locator('[data-testid="confirm-oasys-tag"]')).toContainText('Completed')
    await page.getByRole('link', { name: 'Add additional information' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Add additional information/)
    await page.getByLabel('Provide additional information').fill('Test additional information')
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Make a referral/)
    await expect(page.locator('[data-testid="additional-information-tag"]')).toContainText('Completed')
    await page.getByRole('link', { name: 'Check answers and submit' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Check your answers/)
    await page.getByLabel('I confirm the information I have provided is complete, accurate and up to date.').check()
    await page.getByRole('button', { name: /Submit referral/ }).click()
    await expect(page.locator('h1')).toContainText('Referral complete')
    await page.getByRole('button', { name: /Go to my referrals/ }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - My referrals/)
}

export async function clickOnOffenderLink(page: Page, linkName: string, fullName: string) {
    // Click on 'Date referred' link first
    await page.getByRole('link', { name: linkName }).click()

    // Get the link with person's full name
    const nameLink = await page.getByRole('link', { name: fullName })

    // Check if the link is visible
    if (!(await nameLink.isVisible())) {
        // If not visible, click 'Date referred' again
        await page.getByRole('link', { name: linkName }).click()
    }

    // Click on the link with person's full name
    await nameLink.click()
}

interface RoSHRiskAssertion {
    riskToChildren: string
    riskToPublic: string
    riskToKnownAdult: string
    riskToStaff: string
    riskToPrisoners: string
}
export async function assertRoSHRiskTable(page: Page, assertions: RoSHRiskAssertion) {
    const selectors = {
        riskToChildren: 'tbody.govuk-table__body tr.govuk-table__row:nth-child(1) td.govuk-table__cell',
        riskToPublic: 'tbody.govuk-table__body tr.govuk-table__row:nth-child(2) td.govuk-table__cell',
        riskToKnownAdult: 'tbody.govuk-table__body tr.govuk-table__row:nth-child(3) td.govuk-table__cell',
        riskToStaff: 'tbody.govuk-table__body tr.govuk-table__row:nth-child(4) td.govuk-table__cell',
        riskToPrisoners: 'tbody.govuk-table__body tr.govuk-table__row:nth-child(5) td.govuk-table__cell',
    }

    for (const key of Object.keys(assertions)) {
        const expectedValue = assertions[key as keyof RoSHRiskAssertion]
        const selector = selectors[key as keyof typeof selectors]

        // Wait for the selector to appear and check its inner text against expectedValue
        await page.waitForSelector(`${selector}:not(.rosh-table__cell--unknown):has-text("${expectedValue}")`)
    }
}

export const oasysImportDateText = '[data-testid="imported-from-text"]'
export const apFormattedTodayDate = format(new Date(), 'd MMMM yyyy')
