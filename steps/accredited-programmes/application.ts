import { expect, Page } from '@playwright/test'
import { DateTime } from 'luxon'
import { formatDate } from '../delius/utils/date-time.js'
import { faker } from '@faker-js/faker'
import { Person } from '../delius/utils/person'
import { CreatedEvent } from '../delius/event/create-event'

export async function findProgrammeAndMakeReferral(page: Page, nomisId: string, programmeName?: string) {
    await page.getByRole('link', { name: 'Find a programme and make a referral' }).click()
    await expect(page).toHaveTitle(/Find recommended programmes - Accredited Programmes - DPS/)
    await page
        .getByLabel(
            "Enter a prison number to check what programmes are recommended based on the person's risks and needs."
        )
        .fill(nomisId)
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/Accredited Programmes - DPS/)
    await page.getByRole('button', { name: /See all programmes/ }).click()

    if (programmeName == 'Accredited Programme') {
        await page.getByRole('link', { name: 'Building Choices: moderate' }).click()
        await expect(page).toHaveTitle(/Accredited Programmes - DPS/)
        await page.getByRole('radio', { name: 'No' }).click()
        await page.getByRole('button', { name: 'Continue' }).click()

        await page.getByRole('cell', { name: 'Hindley (HMP & YOI)' }).getByRole('link').click()
        await expect(page).toHaveTitle(/Building Choices: moderate intensity/)
    } else {
        await page.getByRole('link', { name: 'Becoming New Me Plus: general violence offence' }).click()
        await expect(page).toHaveTitle(/Becoming New Me Plus: general violence offence programme description - DPS/)
        await page.getByRole('cell', { name: 'Moorland (HMP & YOI)' }).getByRole('link').click()

        await expect(page).toHaveTitle(/Becoming New Me Plus: general violence offence programme/)
    }

    await page.getByRole('button', { name: /Make a referral/ }).click()
    await expect(page).toHaveTitle(/Start referral - Accredited Programmes/)
    await page.getByRole('button', { name: 'Start now' }).click()
    await expect(page).toHaveTitle(/Confirm person's details - Accredited Programmes/)
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/Referral tasks to complete - Accredited Programmes/)
    await page.getByRole('link', { name: 'Review Accredited Programme history' }).click()
    await expect(page).toHaveTitle(/Person's Accredited Programme history/)
    await page.getByRole('button', { name: /Return to tasklist/ }).click()
    await expect(page).toHaveTitle(/Referral tasks to complete - Accredited Programmes/)
    await expect(page.locator('[data-testid="programme-history-tag"]')).toContainText('Completed')
    await page.getByRole('link', { name: 'Check risks and needs information (OASys)' }).click()
    await expect(page).toHaveTitle(/Check risks and needs information - Accredited Programmes/)
    await page.getByRole('checkbox', { name: /I confirm that the OASys information is up to date./ }).click()
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/Referral tasks to complete - Accredited Programmes/)
    await expect(page.locator('[data-testid="confirm-oasys-tag"]')).toContainText('Completed')
    await page.getByRole('link', { name: 'Add additional information' }).click()
    await expect(page).toHaveTitle(/Add additional information - Accredited Programmes/)
    await page.getByTestId('referrer-override-reason-text-area').fill('Test reason for the referral')
    await page.getByTestId('additional-information-text-area').fill('Test additional information')
    await page.getByRole('button', { name: /Continue/ }).click()
    await expect(page).toHaveTitle(/Referral tasks to complete - Accredited Programmes/)
    await expect(page.locator('[data-testid="additional-information-tag"]')).toContainText('Completed')
    await page.getByRole('link', { name: 'Check answers and submit' }).click()
    await expect(page).toHaveTitle(/Check your answers - Accredited Programmes/)
    await page.getByLabel('I confirm the information I have provided is complete, accurate and up to date.').check()
    await page.getByRole('button', { name: /Submit referral/ }).click()
    await expect(page.locator('h1')).toContainText('Referral complete')
    await page.getByRole('button', { name: /Go to my referrals/ }).click()
    await expect(page).toHaveTitle(/My open referrals - Accredited Programmes/)
}

export async function clickOnOffenderLink(page: Page, linkName: string, fullName: string) {
    // // Click on 'Date referred' link first
    await page.getByRole('link', { name: linkName }).click()

    // await page.getByLabel("Search by name or prison number").fill(nomisId)

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
        riskToChildren: 'tr:has(th:text("Children")) td:nth-of-type(1)',
        riskToPublic: 'tr:has(th:text("Public")) td:nth-of-type(1)',
        riskToKnownAdult: 'tr:has(th:text("Known adult")) td:nth-of-type(1)',
        riskToStaff: 'tr:has(th:text("Staff")) td:nth-of-type(1)',
        riskToPrisoners: 'tr:has(th:text("Prisoners")) td:nth-of-type(1)',
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

export async function findCase(page: Page, person: Person, crn: string) {
    await page.getByLabel('Primary navigation').getByRole('link', { name: 'Case list' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('Case list')
    await page.locator('#crnOrPersonName').fill(crn)
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await page.locator('a', { hasText: `${person.firstName} ${person.lastName}` }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText(
        `Referral details: ${person.firstName} ${person.lastName}`
    )
}

export async function addCaseToGroup(page: Page, person: Person) {
    await page.getByRole('link', { name: 'Groups' }).click()
    await page.getByRole('link', { name: 'AutoTestGroup' }).click()
    await page.getByRole('link', { name: 'Allocations and waitlist' }).click()
    await page.getByRole('link', { name: 'Waitlist (1)' }).click()
    await page.locator('input[name="add-to-group"]').click()
    await page.getByRole('button', { name: 'Add to group' }).click()

    await expect(page.locator('h1.govuk-fieldset__heading')).toContainText(
        `Add ${person.firstName} ${person.lastName} to this group?`
    )
    await page.locator('input[name="add-to-group"][value="yes"]').click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.locator('h1.govuk-heading-l')).toContainText(
        `${person.firstName} ${person.lastName}'s referral status will change to Scheduled`
    )
    await page.locator('#additional-details').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('.moj-alert__content')).toContainText(
        `${person.firstName} ${person.lastName} was added to this group. Their referral status is now Scheduled.`
    )
}

export async function updateReferralStatusToAwaitingAllocation(
    page: Page,
    person: Person,
    crn: string,
    event: CreatedEvent,
    date: Date
) {
    await expect(page.locator('p:right-of(:text("Programme Name"))').first()).toContainText('Building Choices')

    // Personal details
    await expect(page.locator('p:right-of(:text("Name"))').first()).toContainText(
        person.firstName + ' ' + person.lastName
    )
    await expect(page.locator('p:right-of(:text("CRN"))').first()).toContainText(crn)
    await expect(page.locator('p:right-of(:text("Date of birth"))').first()).toContainText(
        DateTime.fromJSDate(person.dob).setLocale('en-gb').toLocaleString(DateTime.DATE_FULL)
    )
    await expect(page.locator('p:right-of(:text("Sex"))').first()).toContainText(person.sex)

    // Offence History
    await page.locator('a', { hasText: 'Offence History' }).click()
    await expect(page.locator('p:right-of(:text("Offence date"))').first()).toContainText(
        date.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    )

    // Sentence Information
    await page.locator('a', { hasText: 'Sentence Information' }).click()
    await expect(page.locator('p:right-of(:text("Sentence type"))').first()).toContainText(event.outcome)

    // Update referral
    await page.getByRole('button', { name: 'Update referral' }).click()
    await page.getByRole('button', { name: 'Update status' }).click()
    await page.getByRole('radio', { name: 'Awaiting allocation' }).click()
    await page.locator('#more-details').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('.moj-alert__content')).toContainText(
        `${person.firstName} ${person.lastName}'s referral status is now Awaiting allocation.`
    )
    await expect(page.getByRole('heading', { name: 'Awaiting allocation' })).toBeVisible()
}

export async function updateReferralStatus(page: Page) {
    await page.getByRole('button', { name: 'Update referral' }).click()
    await page.getByRole('button', { name: 'Update status' }).click()

    await page.locator('#started-or-completed').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.locator('#more-details').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Submit' }).click()
}

export async function updateReferralStatusToOnProgramme(page: Page, person: Person, crn: string) {
    await findCase(page, person, crn)
    await updateReferralStatus(page)
    await expect(page.locator('.moj-alert__content h2')).toContainText('Referral status updated')
    await expect(page.locator('.moj-alert__content')).toContainText(
        `${person.firstName} ${person.lastName}'s referral status is now On programme.`
    )
    await expect(page.getByRole('heading', { name: 'On programme' })).toBeVisible()
}

export async function updateReferralStatusToComplete(page: Page, person: Person) {
    await updateReferralStatus(page)
    await expect(page.locator('.moj-alert__content h2')).toContainText('Referral status updated')
    await expect(page.locator('.moj-alert__content')).toContainText(
        `${person.firstName} ${person.lastName}'s referral status is now Programme complete.`
    )
    await expect(page.getByRole('heading', { name: 'Programme complete' })).toBeVisible()
}

export const oasysImportDateText = '[data-testid="last-assessment-date-text"]'
export const apFormattedTodayDate = formatDate(DateTime.now(), 'd MMMM yyyy')
export const briefOffenceDetailsSummaryCard = '[data-testid="brief-offence-details-summary-card"]'
