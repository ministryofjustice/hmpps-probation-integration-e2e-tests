import { type Page, expect } from '@playwright/test'

export const addMoveOnInformation = async (page: Page) => {
    await page.locator('#duration').fill("12")
    await page.locator('button', { hasText: 'Save and continue' }).click();
    await expect(page.locator('[for="postcodeArea"]')).toContainText(/.*Where is [A-Z][a-z'’-]+([ -][A-Z][A-z'’-]+)* most likely to live when they move on from the AP.*/)
    await page.locator('#postcodeArea').fill("SW11")
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    //"Are move on arrangements already in place for when the person leaves the AP?" Page
    await expect(page.locator('#main-content legend')).toContainText('Are move on arrangements already in place for when the person leaves the AP?')
    await page.locator('#arePlansInPlace-2').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#accommodationType-hint')).toContainText(/.*What type of accommodation will [A-Z][a-z'’-]+([ -][A-Z][A-z'’-]+)* have when they leave the AP.*/)
    await page.locator('#accommodationType').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#move-on-status')).toHaveText("Completed")
}
