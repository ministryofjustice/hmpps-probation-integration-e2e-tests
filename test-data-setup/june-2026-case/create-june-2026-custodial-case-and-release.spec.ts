import { expect, test } from '@playwright/test'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { slow } from '../../steps/common/common'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { findCustodyForEventByCRN } from '../../steps/delius/event/find-events'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { data } from '../../test-data/test-data'

test('Create a six-month custodial case dated 1 June 2026 and release from prison', async ({ page }) => {
    slow()
    const person = deliusPerson()

    await loginDelius(page)
    const crn = await createOffender(page, { person, providerName: process.env.ALLOCATION_PROVIDER })
    await createCustodialEvent(page, {
        crn,
        date: new Date(2026, 5, 1),
        event: {
            ...data.events.custodial,
            outcome: 'Adult Custody < 12m',
            length: '6',
        },
    })

    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    await findCustodyForEventByCRN(page, crn, 1)
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(1), {
        timeout: 180_000,
    })

    await releasePrisoner(nomisId)
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'In the Community')]")).toHaveCount(1), {
        timeout: 180_000,
    })
})
