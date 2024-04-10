import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as dpsLogin } from '../../steps/dps/login'
import { createAndBookPrisoner, releasePrisoner, updateCustodyDates } from '../../steps/api/dps/prison-api'
import { NextMonth, Yesterday } from '../../steps/delius/utils/date-time'
import { format } from 'date-fns'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import * as dotenv from 'dotenv'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { data } from '../../test-data/test-data'
import { switchCaseload } from '../../steps/dps/caseload'

dotenv.config() // read environment variables into process.env

const nomisIds = []
const bookingIds = []

test('View Community manager details', async ({ page }) => {
    // Given a prisoner with a release date within the next 12 weeks
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
    const { nomisId, bookingId } = await createAndBookPrisoner(page, crn, person)
    await updateCustodyDates(bookingId, { conditionalReleaseDate: format(NextMonth, 'yyyy-MM-dd') })
    nomisIds.push(nomisId)
    bookingIds.push(bookingId)

    // When I allocate them to a Community Manager
    await internalTransfer(page, { crn, allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff } })

    // Then the Community Manager details appear in the Get Someone Ready To Work service
    await dpsLogin(page)
    await switchCaseload(page, 'SWI')
    await page.getByRole('link', { name: 'Get someone ready to work' }).first().click()
    await page.locator('[class="govuk-link card__link"]', { hasText: 'Get someone ready to work'}).click()

    await page.getByLabel(`Profile link for ${person.lastName}, ${person.firstName}`).click()
    await page.getByRole('link', { name: 'Contacts' }).click()
    await expect(page.locator('main')).toContainText(data.staff.genericStaff.firstName)
    await expect(page.locator('main')).toContainText(data.staff.genericStaff.lastName)
})

test.afterAll(async () => {
    for (const bookingId of bookingIds) {
        await updateCustodyDates(bookingId, { conditionalReleaseDate: format(Yesterday, 'yyyy-MM-dd') })
    }
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
