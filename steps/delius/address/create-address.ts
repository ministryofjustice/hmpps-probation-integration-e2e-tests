import { expect, type Page } from '@playwright/test'
import { selectOption, selectOptionAndWait } from '../utils/inputs.js'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { faker } from '@faker-js/faker'

export interface Address {
    buildingNumber: string
    street: string
    cityName: string
    county: string
    zipCode: string
}

export const buildAddress = () => {
    return {
        buildingNumber: faker.address.buildingNumber(),
        street: faker.address.street(),
        cityName: faker.address.cityName(),
        county: faker.address.county(),
        zipCode: faker.address.zipCode(),
    }
}

export const createAddress = async (page: Page, crn: string, options: Address) => {
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await page.getByRole('link', { name: 'Addresses' }).click()
    await expect(page.locator('h1')).toHaveText('Addresses and Accommodation')
    await page.getByRole('button', { name: 'Add Address' }).click()
    await expect(page.locator('h1')).toHaveText('Add Address')
    await page.getByLabel(/House Number/).fill(options.buildingNumber)
    await page.getByLabel(/Street Name/).fill(options.street)
    await page.getByLabel(/City/).fill(options.cityName)
    await page.getByLabel(/County/).fill(options.county)
    await page.getByLabel(/Postcode/).fill(options.zipCode)
    await selectOptionAndWait(page, '#addAddressForm\\:AddressStatus', 'Main')
    await selectOption(page, '#addAddressForm\\:AddressType', null, option => option !== 'Awaiting Assessment')
    await page.getByLabel(/Type Verified/).selectOption('Yes')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('h1')).toHaveText('Addresses and Accommodation')
}
