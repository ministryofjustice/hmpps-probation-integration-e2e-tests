import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as sasLogin } from '../../steps/sas/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { data } from '../../test-data/test-data'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { searchForPerson } from '../../steps/sas/offender-record'

test('Create person and check the record is updated on SAS', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person: person, providerName: data.teams.allocationsTestTeam.provider })
    const address = buildAddress()
    await createAddress(page, crn, address)

    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.allocationsTestTeam, staff: data.staff.automatedTestUser },
    })

    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.accreditedProgrammesTestTeam, staff: data.staff.automatedTestUser },
        reason: 'Case Allocated to NPS',
    })

    // Login to SAS to check offender address details
    await sasLogin(page)
    await searchForPerson(page, crn, person)
    const addressLocator = page.locator('//tbody/tr/td[3]')
    await expect(addressLocator).toContainText(address.buildingNumber)
    await expect(addressLocator).toContainText(address.street)
    await expect(addressLocator).toContainText(address.cityName)
    await expect(addressLocator).toContainText(address.zipCode)
})
