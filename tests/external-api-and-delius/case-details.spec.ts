import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { geCaseDetails } from '../../steps/api/external-api/external-api'

test('can retrieve case details', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()

    const crn: string = await createOffender(page, {
        person: person,
        providerName: data.teams.referAndMonitorTestTeam.provider,
    })
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.genericTeam } })

    const json = await geCaseDetails(crn)
    const supervision = json.supervisions[0]

    expect(supervision.active).toBe(true)
    expect(supervision.date).toBeTruthy()
    expect(supervision.sentence.description).toBe('Adult Custody < 12m')
    expect(supervision.sentence.custodial).toBeTruthy()
    expect(supervision.mainOffence.code).toBeTruthy()
    expect(supervision.additionalOffences.length).toBe(0)
    expect(supervision.courtAppearances.length).toBe(1)
    expect(supervision.courtAppearances[0].court).toBeTruthy()
})
