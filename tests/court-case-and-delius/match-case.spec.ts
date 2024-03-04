import { test } from '@playwright/test'
import { addCourtHearing } from '../../steps/court-case/add-court-hearing'
import { deliusPerson } from '../../steps/delius/utils/person'

test('Match Delius case with Court Case Hearing', async () => {
    // Given a person with hearing in the Court Case Service
    const person = deliusPerson()
    await addCourtHearing(person)
    console.log('Added court hearing for', person)

    // When I create the person's record in Delius
    // ...

    // Then the CRN is matched with the hearing and added to the court case service
    // ...
})
