import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { faker } from '@faker-js/faker'

export const createAddress = async (page: Page, crn: string) => {
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await page.getByRole('link', { name: 'Addresses' }).click()
    await expect(page.locator('h1')).toHaveText('Addresses and Accommodation')
    await page.getByRole('button', { name: 'Add Address' }).click()
    await expect(page.locator('h1')).toHaveText('Add Address')
    await page.getByLabel(/House Number/).fill(faker.address.buildingNumber())
    await page.getByLabel(/Street Name/).fill(faker.address.street())
    await page.getByLabel(/City/).fill(faker.address.cityName())
    await page.getByLabel(/County/).fill(faker.address.county())
    await page.getByLabel(/Postcode/).fill(faker.address.zipCode())
    await page.getByLabel(/Status/).selectOption('Main')
    await selectOption(page, '#addAddressForm\\:AddressType')
    await page.getByLabel(/Type Verified/).selectOption('Yes')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('h1')).toHaveText('Addresses and Accommodation')
}
