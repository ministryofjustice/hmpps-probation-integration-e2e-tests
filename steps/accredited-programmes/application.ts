import { expect, Page } from '@playwright/test'
import { DateTime } from 'luxon'
import { formatDate } from '../delius/utils/date-time.js'

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
    await page.getByRole('link', { name: 'Check risks and needs information (OASys)' }).click()
    await expect(page).toHaveTitle(/HMPPS Accredited Programmes - Check risks and needs information/)
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
    const nameLink = page.getByRole('link', { name: fullName })

    // Check if the link is visible
    if (!(await nameLink.isVisible())) {
        // If not visible, click 'Date referred' again
        await page.getByRole('link', { name: linkName }).click()
    }

    // Click on the link with person's full name
    await nameLink.click()
}

export async function verifyAssessmentDateTextToBe(page: Page, expectedText: string) {
    // Selector for the assessment date
    const locator = page.locator(oasysImportDateText).first()

    // Fetch the text from the locator and normalize it
    const actualText = await locator.evaluate(el => el.textContent?.trim().replace(/\s+/g, ' '))

    // Verify that the normalized text matches the expected text
    expect(actualText).toBe(expectedText)
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
        riskToChildren: 'tr:has(td:text("Children")) td:nth-of-type(3)',
        riskToPublic: 'tr:has(td:text("Public")) td:nth-of-type(3)',
        riskToKnownAdult: 'tr:has(td:text("Known adult")) td:nth-of-type(3)',
        riskToStaff: 'tr:has(td:text("Staff")) td:nth-of-type(3)',
        riskToPrisoners: 'tr:has(td:text("Prisoners")) td:nth-of-type(3)',
    }

    for (const [key, expectedValue] of Object.entries(assertions)) {
        const selector = selectors[key as keyof typeof selectors]

        // Wait for the cell text to match the expected value
        const cell = page.locator(selector)
        await cell.waitFor()

        const actualValue = await cell.textContent()

        if (actualValue?.trim() !== expectedValue) {
            throw new Error(`Expected "${expectedValue}" but found "${actualValue?.trim()}" for "${key}"`)
        }
    }
}

export const oasysImportDateText = '[data-testid="last-assessment-date-text"]'
export const apFormattedTodayDate = formatDate(DateTime.now(), 'd MMMM yyyy')
export const briefOffenceDetailsSummaryCard = '[data-testid="brief-offence-details-summary-card"]'
