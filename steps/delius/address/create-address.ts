import { expect, type Page } from '@playwright/test'
import { selectOption, selectOptionAndWait } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'
import { faker } from '@faker-js/faker'

export interface Address {
    buildingNumber: string
    street: string
    cityName: string
    county: string
    zipCode: string
}

export const buildAddress = (): Address => {
    return {
        buildingNumber: faker.location.buildingNumber(),
        street: faker.location.street(),
        cityName: faker.location.city(),
        county: faker.location.county(),
        zipCode: faker.location.zipCode(),
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
    await selectOptionAndWait(page, '#addressStatus\\:selectOneMenu', 'Main')
    await selectOption(page, '#addressType\\:selectOneMenu', null, option => option !== 'Awaiting Assessment')
    await page.getByLabel(/Type Verified/).selectOption('Yes')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('h1')).toHaveText('Addresses and Accommodation')
}
