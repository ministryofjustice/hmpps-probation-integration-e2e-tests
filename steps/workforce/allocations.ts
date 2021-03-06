import {expect, Page} from "@playwright/test"
import {refreshUntil} from "../delius/utils/refresh";
import {Practitioner} from "../delius/utils/person";

export const viewAllocation = async (page: Page, crn: string) => {
    const locator = await page.locator("tr", {hasText: crn})
    await refreshUntil(page, async () => await locator.count() > 0)
    await page.locator("tr", {hasText: crn}).locator("a", {hasText: "Review case"}).click()
    await expect(page.locator(".govuk-caption-xl", {hasText: crn})).toHaveText(`CRN: ${crn}`)
}

export const allocateCase = async (page: Page, crn: string, practitioner: Practitioner) => {
    await viewAllocation(page, crn)
    // Navigate to allocation page
    await page.locator("a", {hasText: "Allocate case"}).click()
    await expect(page).toHaveTitle(/.*Choose practitioner.*/)

    // Allocate to practitioner
    await page.locator("tr", {hasText: `${practitioner.firstName} ${practitioner.lastName}`})
        .locator(".govuk-radios__input").click()
    await page.locator("button", {hasText: "Allocate case"}).click()

    // Confirm allocation to practitioner
    await expect(page).toHaveTitle(/.*Allocate to practitioner.*/)
    await page.locator("a", {hasText: "Continue"}).click()

    // Review and submit allocation to practitioner
    await expect(page).toHaveTitle(/.*Review allocation instructions.*/)
    await page.fill("#instructions", `Allocation for ${crn} completed by hmpps-end-to-end-tests`)
    await page.locator("button", {hasText: "Continue"}).click()
    await page.locator("div.govuk-panel--confirmation >> h1.govuk-panel__title", {hasText: "Allocation complete"})
}
