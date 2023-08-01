import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import {
    createAndBookPrisoner,
    recallPrisoner,
    releasePrisoner,
    temporaryAbsenceReturn,
    temporaryReleasePrisoner,
} from '../../steps/api/dps/prison-api'
import { findCustodyForEventByCRN } from '../../steps/delius/event/find-events'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { createRelease } from '../../steps/delius/release/create-release'
import { createLicenceCondition } from '../../steps/delius/licence-condition/create-licence-condition'

const nomisIds = []

test('Release and recall test', async ({ page }) => {
    test.slow() // increase the timeout - releases/recall publishing can take a few minutes

    // Given a person with a sentenced event in Delius
    await deliusLogin(page)
    // await hmppsLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })

    // And a corresponding person and booking in NOMIS
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    await findCustodyForEventByCRN(page, crn, 1)
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(3), {
        timeout: 180_000,
    })

    // When the person in nomis is released
    await releasePrisoner(nomisId)
    // Then the person is released in Delius
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'In the Community')]")).toHaveCount(1), {
        timeout: 180_000,
    })

    // When the person in nomis is recalled
    await recallPrisoner(nomisId)
    // Then the person is recalled in Delius
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(3), {
        timeout: 180_000,
    })
})

test('Temporary absence test', async ({ page }) => {
    test.slow() // increase the timeout - releases/recall publishing can take a few minutes
    // Given a person with a sentenced event in Delius
    await deliusLogin(page)
    // await hmppsLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })

    // And a corresponding person and booking in NOMIS
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    await findCustodyForEventByCRN(page, crn, 1)
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(3), {
        timeout: 180_000,
    })

    await temporaryReleasePrisoner(nomisId)
    await createRelease(page, crn, 1, true)
    await createLicenceCondition(page, crn, 1)

    // When the person returns to custody
    await temporaryAbsenceReturn(nomisId)

    await findCustodyForEventByCRN(page, crn, 1)
    // Then the person is recalled in Delius
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(3), {
        timeout: 180_000,
    })
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
