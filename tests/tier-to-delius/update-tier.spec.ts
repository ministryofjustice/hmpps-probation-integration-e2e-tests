import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as tierLogin } from '../../steps/tier-ui/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { createRegistration } from '../../steps/delius/registration/create-registration'
import { searchTierByCRN } from '../../steps/tier-ui/search_tier'

dotenv.config() // read environment variables into process.env

test('Create person and check tier is updated', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I create the registration
    await createRegistration(page, crn, 'High RoSH')

    // Then the tier is updated
    await page.locator('a', { hasText: 'Management Tier' }).click()
    await refreshUntil(page, () => expect(page.locator('table')).toContainText('B_0'))
    await expect(page.locator('#offender-overview').first()).toContainText('Tier:B_0')
    await tierLogin(page)
    await searchTierByCRN(page, crn, person)
    expect(page.locator("[data-qa='crn']")).toHaveText(crn)
    expect(page.locator("[data-qa='sex']")).toHaveText(person.sex)
    expect(page.locator("[data-qa='tier']")).toContainText('B0')
    expect(page.locator("[data-qa='protect-table']  tr td").first()).toContainText('High RoSH')
})
