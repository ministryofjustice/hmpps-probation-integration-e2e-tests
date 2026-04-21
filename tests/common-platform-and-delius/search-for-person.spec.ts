import { test } from '@playwright/test'
import { deliusPerson } from '../../steps/delius/utils/person'
import { hearingData } from '../../steps/court-case/hearing-data'
import { addCourtHearing } from '../../steps/api/court-case/court-case-api'

test('Send a large court message', async () => {
    const person = deliusPerson()
    await addCourtHearing(hearingData(person))
    console.log('Sent court hearing for', person)
})
