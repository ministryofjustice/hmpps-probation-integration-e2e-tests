import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { data } from '../../test-data/test-data'
import { removeNomisId } from '../../steps/delius/offender/update-offender'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { triggerMatching } from '../../steps/api/prison-identifier-and-delius/prison-identifier-and-delius'
import { recallPrisoner } from '../../steps/api/dps/prison-api'

test('Match prisoner', async ({ page }) => {
    // Given a sentenced prisoner, with no identifier in Delius
    const prisoner = data.prisoners.sentencedPrisonerForMatching
    try {
        await recallPrisoner(prisoner.nomsNumber)
    } catch {
        console.warn('Prisoner recall failed; continuing with matching using the existing NOMIS custody state.')
    }
    await deliusLogin(page)
    await removeNomisId(page, prisoner.crn)

    // When the matching process is triggered
    // (note this is usually triggered by a prison event, however we cannot programmatically trigger sentence changes in NOMIS ...yet)
    await triggerMatching(prisoner.nomsNumber)

    // Then the identifier is added to Delius
    await findOffenderByCRN(page, prisoner.crn)
    const nomsNumberUpdated = () => expect(page.locator('#nomsNumber\\:outputText')).toContainText(prisoner.nomsNumber)
    await refreshUntil(page, nomsNumberUpdated, { timeout: 180_000 })
})