import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const completeGPDetails = async (page: Page) => {
    await page.getByRole('button', { name: 'Add GP' }).click();
    await page.getByLabel('Name (Optional)').click();
    await page.getByLabel('Name (Optional)').fill(faker.name.fullName());
    await page.getByLabel('GP practice name').fill('Sheffield Medical practice');
    await page.getByLabel('Building name').fill(faker.address.buildingNumber());
    await page.getByLabel('Street name').fill(faker.address.streetName());
    await page.getByLabel('District').fill(faker.address.city());
    await page.getByLabel('Town or city').fill(faker.address.city());
    await page.getByLabel('County').fill(faker.address.county());
    await page.getByLabel('Postcode').fill(faker.address.zipCode());
    await page.getByLabel('Phone number').fill(faker.phone.number());
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.govuk-heading-xl')).toContainText('GP Details')
    await page.getByRole('group', { name: 'Mark GP details section as complete?' }).getByLabel('Yes').check();
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
