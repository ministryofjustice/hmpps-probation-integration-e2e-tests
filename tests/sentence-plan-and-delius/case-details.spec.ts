import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { getCaseDetails } from '../../steps/api/sentence-plan/sentence-plan-and-delius'
import * as dotenv from 'dotenv'

dotenv.config()

test('can retrieve case details', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person: person })

    const json = await getCaseDetails(crn)

    expect(json.crn).toBe(crn)
    expect(json.name.forename).toBe(person.firstName)
    expect(json.name.surname).toBe(person.lastName)
})
