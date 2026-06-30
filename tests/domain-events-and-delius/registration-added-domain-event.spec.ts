import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as tierLogin } from '../../steps/tier-ui/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createRegistration } from '../../steps/delius/registration/create-registration'
import { searchTierByCRN } from '../../steps/tier-ui/search_tier'

test('Adding a registration updates the tier', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I create the registration
    await createRegistration(page, crn, 'High RoSH')
    await tierLogin(page)
    await searchTierByCRN(page, crn, person)
    expect(page.locator("[data-qa='case-details-header-crn']")).toHaveText(crn)
    expect(page.locator("[data-qa='case-details-header-tier']")).toContainText('B0')
    expect(page.locator("[data-qa='protect-table']  tr td").first()).toContainText('High RoSH')
})
