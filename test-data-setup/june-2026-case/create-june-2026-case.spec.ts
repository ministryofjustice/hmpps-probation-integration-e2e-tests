import { expect, test, type Page } from '@playwright/test'
import { addCourtHearing } from '../../steps/api/court-case/court-case-api'
import {
    createAndBookPrisoner,
    createAndBookPrisonerWithoutDeliusLink,
    releasePrisoner,
} from '../../steps/api/dps/prison-api'
import { slow } from '../../steps/common/common'
import { hearingData } from '../../steps/court-case/hearing-data'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { transferToDeliusUser } from '../../steps/delius/transfer/internal-transfer'
import { fillDate, fillDateOasys, selectOption } from '../../steps/delius/utils/inputs'
import { deliusPerson } from '../../steps/delius/utils/person'
import { waitForJS } from '../../steps/delius/utils/refresh'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { data } from '../../test-data/test-data'

// Run with TEST_DIR=./test-data-setup npx playwright test june-2026-case.
// op run --account ministryofjustice.1password.eu --env-file=./.env.1password -- env TEST_DIR=./test-data-setup npx playwright test june-2026-case --headed
// op run --account ministryofjustice.1password.eu --env-file=./.env.1password --  env TEST_DIR=./test-data-setup CREATE_OASYS_ASSESSMENT=true npx playwright test june-2026-case --headed
// Set CREATE_OASYS_ASSESSMENT or CREATE_COURT_HEARING to true to include them.
const offenceAndSentenceDate = new Date(2026, 5, 1)

async function createDatedEvent(page: Page, crn: string, custodial: boolean) {
    const event = custodial ? data.events.custodial : data.events.community
    await findOffenderByCRN(page, crn)
    await page.click('#navigation-include\\:linkNavigation2EventList')
    await expect(page).toHaveTitle(/Events/)
    await page.locator('input', { hasText: 'Add' }).click()
    for (const selector of [
        '#ReferralDate\\:datePicker',
        '#OffenceDate\\:datePicker',
        '#ConvictionDate\\:datePicker',
    ]) {
        await fillDate(page, selector, offenceAndSentenceDate)
    }
    await waitForJS(page, 1000)
    await selectOption(page, '#MainOffence\\:selectOneMenu', event.mainOffence, option => !option.startsWith('('))
    await selectOption(page, '#Court\\:selectOneMenu')
    await selectOption(page, '#Area\\:selectOneMenu')
    await selectOption(page, '#Team\\:selectOneMenu')
    await selectOption(page, '#AppearanceType\\:selectOneMenu', event.appearanceType)
    await selectOption(page, '#Plea\\:selectOneMenu')
    await selectOption(page, '#Outcome\\:selectOneMenu', event.outcome)
    await selectOption(page, '#OutcomeArea\\:selectOneMenu')
    await selectOption(page, '#OutcomeTeam\\:selectOneMenu')
    await selectOption(page, '#jfda\\:selectOneMenu', 'No')
    if (event.length) await page.fill('#Length', event.length)
    await page.focus('#content')
    await page.locator('input', { hasText: 'Save' }).click()
    await expect(page).toHaveTitle(/Add Requirements/)
}

async function setOasysDates(page: Page) {
    await page.getByRole('link', { name: 'Section 1' }).click()
    await page.getByRole('link', { name: 'Offending Information' }).click()
    await expect(page.getByRole('heading', { name: '1 - Offending Information (Layer 3)' })).toBeVisible()

    const predictors = page.getByRole('link', { name: 'Predictors' })
    if (!(await predictors.isVisible())) {
        await page.getByRole('link', { name: 'Section 1' }).click()
    }
    await predictors.click()
    for (const selector of ['#itm_1_29', '#itm_1_33', '#itm_1_38']) {
        await fillDateOasys(page, selector, offenceAndSentenceDate)
    }
    await page.locator('#B6737316531953403').click()
}

test('Create a case with offence and sentence dates of 1 June 2026', async ({ page }) => {
    slow()
    const person = deliusPerson()
    const createDelius = process.env.CREATE_DELIUS_RECORD !== 'false'
    const createNomis = process.env.CREATE_NOMIS_RECORD == 'false'

    if (!createDelius && process.env.CREATE_OASYS_ASSESSMENT === 'true') {
        throw new Error('Cannot create an OASys assessment without a Delius record')
    }

    if (createDelius) {
        await loginDelius(page)
        const owningProvider = process.env.ALLOCATION_PROVIDER || null
        const crn = await createOffender(page, { person, providerName: owningProvider })
        await createDatedEvent(page, crn, createNomis)
        if (createNomis) {
            const { nomisId } = await createAndBookPrisoner(page, crn, person)
            await releasePrisoner(nomisId)
        }
        if (process.env.ALLOCATE_TO_USER === 'true') {
            await transferToDeliusUser(page, {
                crn,
                provider: owningProvider,
                team: process.env.ALLOCATION_TEAM,
                firstName: process.env.ALLOCATION_FIRST_NAME,
                lastName: process.env.ALLOCATION_LAST_NAME,
            })
        }
        if (process.env.CREATE_OASYS_ASSESSMENT === 'true') {
            await oasysLogin(page, UserType.Assessment)
            await createLayer3CompleteAssessment(page, crn, person)
            await setOasysDates(page)
            await addLayer3AssessmentNeeds(page)
        }
    } else if (createNomis) {
        const { nomisId } = await createAndBookPrisonerWithoutDeliusLink(page, person)
        await releasePrisoner(nomisId)
    }

    if (process.env.CREATE_COURT_HEARING === 'true') {
        const hearing = hearingData(person)
        hearing.hearing.hearingDays[0].sittingDay = new Date(Date.UTC(2026, 5, 1, 12)).toISOString()
        hearing.hearing.prosecutionCases[0].defendants[0].offences[0].wording =
            'On 01/06/2026 at Oxford,  you assaulted John Smith, thereby occasioning him, actual bodily harm'
        await addCourtHearing(hearing)
    }
})
