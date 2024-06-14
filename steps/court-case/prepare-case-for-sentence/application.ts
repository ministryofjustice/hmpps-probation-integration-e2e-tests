import { expect, Locator, Page } from '@playwright/test'

export async function addCourtToUser(page: Page, court: string) {
    await page.getByRole('button', { name: /Accept analytics cookies/ }).click()
    await page.focus('#pac-select-court')
    await page.keyboard.type(court)
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.locator('[href="?save=true"]', { hasText: 'Save  and continue' }).click()
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
    // Split the date string into day, month, and year
    const parts = dateString.split('/')
    if (parts.length !== 3) {
        throw new Error('Invalid date format. Expected DD/MM/YYYY.')
    }

    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // Months are zero-indexed in JavaScript Date
    const year = parseInt(parts[2], 10)

    // Construct a new Date object
    const dateObject = new Date(year, month, day)

    // Format the date as required
    const formattedDate = dateObject.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    return formattedDate
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
    const outcome = await page.locator('[href^="record/"]').innerText()
    const offence = await page.locator('p:nth-of-type(2)').first().innerText()
    return { outcome, offence }
}
