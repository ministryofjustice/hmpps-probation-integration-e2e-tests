import { expect, Page } from '@playwright/test'

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

export async function getCRNByNameFromCaseList(page: Page, name: string): Promise<string | null> {
    // Locate the row with the given name
    const defendantRow = page.locator(`.govuk-table tbody tr:has-text("${name}")`)

    // Extract the CRN from the row
    const crnElement = defendantRow.locator('.govuk-table__cell .pac-secondary-text')

    // Get the inner text of the CRN element
    const crnText = await crnElement.innerText()

    // Return the CRN
    return crnText.trim() !== '' ? crnText.trim() : null
}
