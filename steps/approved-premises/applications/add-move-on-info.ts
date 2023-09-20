import { type Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const addMoveOnInformation = async (page: Page) => {
    await page.locator('#differentDuration-2').check()
    await page.locator('button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('[for="postcodeArea"]')).toContainText(
        /.*Where is the person most likely to live when they move on from the AP.*/
    )
    await page.locator('#postcodeArea').fill('SW11')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()

    // "Are move on arrangements already in place for when the person leaves the AP?" Page
    await expect(page.locator('#main-content legend')).toContainText(
        'Are move on arrangements already in place for when the person leaves the AP?'
    )
    await page.locator('#arePlansInPlace-2').check()
    await page.locator('#plansNotInPlaceDetail').fill(faker.lorem.paragraph())
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#accommodationType-hint')).toContainText(
        /.*What type of accommodation will the person have when they leave the AP.*/
    )
    await page.locator('#accommodationType').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#move-on-status')).toHaveText('Completed')
}
