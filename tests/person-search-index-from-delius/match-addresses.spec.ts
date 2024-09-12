import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import * as dotenv from 'dotenv'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'

dotenv.config() // read environment variables into process.env

test('Create a person and check their address', async ({ page }) => {
    // Given two people with the same address in Delius
    await deliusLogin(page)
    const address = buildAddress()
    const crn1 = await createOffender(page)
    await createAddress(page, crn1, address)
    const crn2 = await createOffender(page)
    await createAddress(page, crn2, address)

    // When I check for matching addresses on the second CRN
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.getByRole('button', { name: 'Check Address' }).click()

    // Then the first CRN is returned
    await expect(page.locator('#addressSearchResults')).toContainText(crn1)
})
