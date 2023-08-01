import { expect, Page } from '@playwright/test'
import { findEventByCRN } from '../event/find-events'

const findRequirements = async (page: Page, crn, eventNumber) => {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('input[value=Requirements]')
    await expect(page).toHaveTitle(/Component List/)
}

const findRequirement = async (page: Page, crn: string, eventNumber: number, description: string) => {
    await findRequirements(page, crn, eventNumber)
    await page.locator('tr', { hasText: description }).locator('a', { hasText: 'View' }).click()
}

export const validateRarCount = async (
    page: Page,
    crn: string,
    eventNumber: number,
    requirement: { category: string; subCategory: string },
    count: number
) => {
    await findRequirement(page, crn, eventNumber, `${requirement.category} - ${requirement.subCategory}`)
    await page.locator('tr', { hasText: 'CRS Accommodation' }).locator('a', { hasText: 'View' }).click()
    await expect(page.locator('#nsiDetailsForm\\:rarCount')).toHaveText(count.toString())
}
