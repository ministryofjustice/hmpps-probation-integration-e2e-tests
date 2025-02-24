import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const completeGPDetails = async (page: Page) => {
    await page.getByRole('button', { name: 'Add GP' }).click()
    await page.getByLabel('Name (Optional)').click()
    await page.getByLabel('Name (Optional)').fill(faker.person.fullName())
    await page.getByLabel('GP practice name').fill('Sheffield Medical practice')
    await page.getByLabel('Building name').fill(faker.location.buildingNumber())
    await page.getByLabel('Street name').fill(faker.location.street())
    await page.getByLabel('District').fill(faker.location.city())
    await page.getByLabel('Town or city').fill(faker.location.city())
    await page.getByLabel('County').fill(faker.location.county())
    await page.getByLabel('Postcode').fill(faker.location.zipCode())
    await page.getByLabel('Phone number').fill(faker.phone.number())
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('.govuk-heading-xl')).toContainText('GP Details')
    await page.locator('#gp_details_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("GP Details")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
