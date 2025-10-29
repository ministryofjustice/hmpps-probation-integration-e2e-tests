import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as socLogin } from '../../steps/soc/login'
import { formatStaffNameForSOC, referToSOC } from '../../steps/soc/refer-to-soc'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { DeliusDateFormatter } from '../../steps/delius/utils/date-time'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { Allocation, data } from '../../test-data/test-data'

const nomisIds = []
const anotherPractitioner: Allocation = { staff: data.staff.allocationsTester2, team: data.teams.allocationsTestTeam }
test('Add a community nominal to SOC', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()

    // And I create an offender, Custodial Event and Book Prisoner
    const crn = await createOffender(page, { providerName: anotherPractitioner.team.provider })
    await createCustodialEvent(page, { crn })
    let selectedStaff = await internalTransfer(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })
    selectedStaff = formatStaffNameForSOC(selectedStaff)
    const prisonId = 'MDI'
    const { nomisId } = await createAndBookPrisoner(page, crn, person, prisonId)
    nomisIds.push(nomisId)

    // When I add them as a nominal to SOC
    await socLogin(page)
    await referToSOC(page, crn)

    // Then I can see their Delius details
    await page.getByRole('button', { name: 'View summary' }).click()
    await expect(page.locator('[data-qa=dob]')).toContainText(DeliusDateFormatter(person.dob))
    await expect(page.locator('[data-qa=COM]')).toContainText(selectedStaff)
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
