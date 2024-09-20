import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'
import { faker } from '@faker-js/faker/locale/en_GB'

export interface Address {
    type: string
    buildingNumber: string
    street: string
    cityName: string
    county: string
    zipCode: string
}

export const buildAddress = (type: string = 'Main'): Address => {
    return {
        type,
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
    await expect(page.locator('h1')).toContainText('Addresses and Accommodation')
    await page.getByRole('button', { name: 'Add Address' }).click()
    await expect(page.locator('h1')).toContainText('Add Address')
    await page.getByLabel(/House Number/).fill(options.buildingNumber)
    await page.getByLabel(/Street Name/).fill(options.street)
    await page.getByLabel(/City/).fill(options.cityName)
    await page.getByLabel(/County/).fill(options.county)
    await page.getByLabel(/Postcode/).fill(options.zipCode)
    await selectOption(page, '#addressStatus\\:selectOneMenu', options.type)
    await selectOption(page, '#addressType\\:selectOneMenu', null, option => option !== 'Awaiting Assessment')
    await page.getByLabel(/Type Verified/).selectOption('Yes')
    await page.locator('#newNotes\\:notesField').fill(`Notes added for ${options.type} address`)
    await page.getByRole('button', { name: 'Save' }).click()
    if (await page.locator('#j_idt686\\:screenWarningPrompt').isVisible()) {
        await page.locator('input', { hasText: 'Confirm' }).click()
    }

    await expect(page.locator('h1')).toContainText('Addresses and Accommodation')
}
