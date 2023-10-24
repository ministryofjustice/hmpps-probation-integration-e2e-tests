import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as dpsLogin } from '../../steps/dps/login'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document'

dotenv.config() // read environment variables into process.env

const nomisIds = []

test('View probation documents in DPS', async ({ page }) => {
    // Given I create a case in Delius and NOMIS
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    await createCustodialEvent(page, { crn })

    // And add a document to Delius
    await createDocumentFromTemplate(page)

    // When I go to the documents page in DPS
    await dpsLogin(page)
    await page.goto(`${process.env.DPS_URL}/offenders/${nomisId}/probation-documents`)

    // Then the event and the document appear in the list
    await page.getByRole('button', { name: 'Show all sections' }).click()
    await expect(page.locator('#accordion-default-heading-1')).toContainText('Adult Custody < 12m (6 Months)')
    await expect(page.locator('#accordion-default-content-1')).toContainText('Sentence related')
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
