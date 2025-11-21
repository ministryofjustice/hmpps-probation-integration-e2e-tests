import { expect, Locator, Page } from '@playwright/test'
import { DateTime } from 'luxon'

export async function addCourtToUser(page: Page, court: string) {
    await page.getByRole('button', { name: /Accept analytics cookies/ }).click()
    await page.getByRole('link', { name: 'Edit my courts' }).click()
    await page.focus('#pac-select-court')
    await page.keyboard.type(court)
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.locator('[href="?save=true"]', { hasText: 'Save list and continue' }).click()
    await expect(page).toHaveTitle('My courts - Prepare a case for sentence')
    await page.getByRole('link', { name: court }).click()
    await expect(page).toHaveTitle('Case list - Prepare a case for sentence')
}

export async function searchAndClickDefendantAndGetHeader(
    page: Page,
    firstName: string,
    lastName: string,
    crn: string
): Promise<Locator> {
    await page.locator('#search-term').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator('.pac-defendant-link', { hasText: `${firstName} ${lastName}` }).click()

    // Return the locator for '.pac-key-details-bar'
    return page.locator('.pac-key-details-bar')
}

export async function formatDateToPrepareCase(dateString: string): Promise<string> {
    // Parse the date string in the format 'DD/MM/YYYY'
    const parsedDate = DateTime.fromFormat(dateString, 'dd/MM/yyyy')

    // Check if the date is valid
    if (!parsedDate.isValid) {
        throw new Error('Invalid date format')
    }

    // Format the parsed date to 'D MMM YYYY'
    return parsedDate.toFormat('d MMM yyyy')
}

export async function extractRegistrationDetails(page: Page) {
    const [registrationType, registeredDate, nextReviewDate] = await page.evaluate(() => {
        const activeTab = document.querySelector('.govuk-tabs__panel#active')
        const table = activeTab?.querySelector('.govuk-table')
        if (!table) {
            return ['', '', '']
        }
        const firstRow = table.querySelector('.govuk-table__body .govuk-table__row')
        if (!firstRow) {
            return ['', '', '']
        }
        const cells = firstRow.querySelectorAll('.govuk-table__cell')
        return [
            cells?.[0]?.textContent?.trim() ?? '',
            cells?.[1]?.textContent?.trim() ?? '',
            cells?.[2]?.textContent?.trim() ?? '',
        ]
    })

    return { registrationType, registeredDate, nextReviewDate }
}

export async function extractProbationRecordDetails(page: Page): Promise<{ outcome: string; offence: string }> {
    await page.getByRole('link', { name: 'Probation record' }).click()
    await expect(page).toHaveTitle('Probation record - Prepare a case for sentence')
    const outcome = await page.locator('.govuk-summary-card__title').innerText()
    const offence = await page.locator('dd p.govuk-body').first().innerText()
    return { outcome, offence }
}
