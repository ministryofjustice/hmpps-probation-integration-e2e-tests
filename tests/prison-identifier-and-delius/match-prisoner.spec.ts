import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import * as dotenv from 'dotenv'
import { data } from '../../test-data/test-data'
import { removeNomisId } from '../../steps/delius/offender/update-offender'
import { recallPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { refreshUntil } from '../../steps/delius/utils/refresh'

dotenv.config() // read environment variables into process.env

test('Match prisoner', async ({ page }) => {
    // Given a sentenced prisoner, with no identifier in Delius
    const prisoner = data.prisoners.sentencedPrisonerForMatching
    await deliusLogin(page)
    await removeNomisId(page, prisoner.crn)

    // When the prisoner is received into prison
    await recallPrisoner(prisoner.nomsNumber)

    // Then the identifier is added to Delius
    await findOffenderByCRN(page, prisoner.crn)
    const nomsNumberUpdated = () => expect(page.locator('#nomsNumber\\:outputText')).toContainText(prisoner.nomsNumber)
    await refreshUntil(page, nomsNumberUpdated, { timeout: 180_000 })
})

test.afterEach(() => releasePrisoner(data.prisoners.sentencedPrisonerForMatching.nomsNumber))
