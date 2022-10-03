import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import { setNomisId } from '../../steps/delius/offender/update-offender'
import { createAndBookPrisoner, recallPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { findCustodyForEventByCRN } from '../../steps/delius/event/find-events'
import { refreshUntil } from '../../steps/delius/utils/refresh'

const nomisIds = []

test('Release and recall test', async ({ page }) => {
    test.slow() // increase the timeout - releases/recall publishing can take a few minutes

    // Given a person with a sentenced event in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })

    // And a corresponding person and booking in NOMIS
    const nomisId = await createAndBookPrisoner(person)
    nomisIds.push(nomisId)
    await setNomisId(page, crn, nomisId)

    await findCustodyForEventByCRN(page, crn, 1)
    await refreshUntil(
        page,
        () => expect(page.locator("//span[contains(text(),'Moorland (HMP & YOI)')]")).toHaveCount(3),
        { timeout: 180_000 }
    )

    // When the person in nomis is released
    await releasePrisoner(nomisId)
    // Then the person is released in Delius
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'In the Community')]")).toHaveCount(1), {
        timeout: 180_000,
    })

    // When the person in nomis is recalled
    await recallPrisoner(nomisId)
    // Then the person is recalled in Delius
    await refreshUntil(
        page,
        () => expect(page.locator("//span[contains(text(),'Moorland (HMP & YOI)')]")).toHaveCount(3),
        { timeout: 180_000 }
    )
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
