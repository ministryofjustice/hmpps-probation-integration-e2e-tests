import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const completeIndividualDetailsSection = async (page: Page) => {
    await page.getByRole('link', { name: 'Change Contact details' }).click()
    await page.getByLabel('Building name').click()
    await page.getByLabel('Building name').fill(faker.address.buildingNumber())
    await page.getByRole('region', { name: 'Form content' }).click()
    await page.getByLabel('House number').fill(faker.address.buildingNumber())
    await page.getByLabel('Street name').fill(faker.address.streetName())
    await page.getByLabel('District').fill(faker.address.city())
    await page.getByLabel('Town or city').fill(faker.address.city())
    await page.getByLabel('County').fill(faker.address.county())
    await page.getByLabel('Postcode').fill(faker.address.zipCode())
    await page.getByLabel('Mobile number').fill(faker.phone.number())
    await page.getByLabel('Phone number').fill(faker.phone.number())
    await page.getByLabel('Email').fill(faker.internet.email())
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText("Individual's details")
    await page.getByRole('button', { name: 'Add contact' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Emergency contact')
    await page.locator('#emergency_contact_first_name').click()
    await page.locator('#emergency_contact_first_name').press('CapsLock')
    await page.locator('#emergency_contact_first_name').fill(faker.name.firstName())
    await page.getByLabel('Surname').fill(faker.name.lastName())
    await page.getByLabel('Relationship to the individual').press('CapsLock')
    await page.getByLabel('Relationship to the individual').fill('Friend')
    await page.getByLabel('Mobile').fill(faker.phone.number())
    await page.getByLabel('Phone number').fill(faker.phone.number())
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText("Individual's details")
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}