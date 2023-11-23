import { expect, test } from '@playwright/test'
import { login as hdcLogin } from '../../steps/hdc-licences/login'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { data } from '../../test-data/test-data'

const nomisIds = []

test('View community manager in HDC', async ({ page }) => {
    // Given a case in Delius and NOMIS
    await deliusLogin(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // When I navigate to the case in HDC licences
    await hdcLogin(page)
    await page.getByRole('link', { name: 'Search all offenders' }).click()
    await page.getByLabel(/Enter prisoner name or ID/).fill(nomisId)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: 'Update HDC licence' }).click()
    const popup = await page.waitForEvent('popup')

    // Then I can see the probation data
    await popup.locator('#prisonerComName a').click()
    await expect(popup.locator(":text('Probation area') ~ div").first()).toContainText(data.teams.genericTeam.provider)
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
