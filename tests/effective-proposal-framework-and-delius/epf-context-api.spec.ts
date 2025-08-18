import { test, expect } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import { epfContext } from '../../steps/api/epf/epf-api'
import { data } from '../../test-data/test-data'
import { DateTime } from 'luxon'

test('test epf context api endpoint', async ({ page }) => {
    // Given a person with a sentenced event in Delius
    await deliusLogin(page)
    const person = deliusPerson()

    const crn: string = await createOffender(page, {
        person: person,
    })
    const event = await createCustodialEvent(page, { crn })

    //get the epf context and check the json returned is correct
    const json = await epfContext(crn, '1')

    expect(json.name.forename).toBe(person.firstName)
    expect(json.name.surname).toBe(person.lastName)
    expect(json.name.middleName).toBe('')
    const expectedDate = DateTime.fromJSDate(new Date(person.dob)).toFormat('yyyy-LL-dd')
    expect(json.dateOfBirth).toBe(expectedDate)
    expect(json.gender).toBe(person.sex)
    expect(json.courtAppearance.court.name).toBe(event.court)
})
