import { expect, test } from '@playwright/test'
import { DateTime } from 'luxon'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { getSupervisionPackagesContext } from '../../steps/api/supervision-packages/supervision-packages-api'
import { slow } from '../../steps/common/common'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { findCustodyForEventByCRN } from '../../steps/delius/event/find-events'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createLiferRegistration } from '../../steps/delius/registration/create-lifer-registration'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { deliusPerson } from '../../steps/delius/utils/person'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer1CompleteAssessment } from '../../steps/oasys/layer1-assessment/create-layer1-assessment/create-layer1-assessment'
import { signAndlock } from '../../steps/oasys/layer1-assessment/sign-and-lock'
import { data } from '../../test-data/test-data'
//op run --account ministryofjustice.1password.eu --env-file=./.env.1password -- \
//env TEST_DIR=./test-data-setup npx playwright test supervision-packages-cases/create-2010-lifer-case.spec.ts

test('Create a low-risk lifer sentenced in 2010 and released seven years ago', async ({ page }) => {
    slow(12)
    const now = DateTime.now().setZone('Europe/London').startOf('day')
    const sentence = DateTime.fromObject({ year: 2010, month: 6, day: 1 }, { zone: 'Europe/London' })
    const release = now.minus({ years: 7 }).set({ hour: 12 })
    if (release <= sentence) {
        throw new Error('The release date must be after the sentence and booking date')
    }
    const person = deliusPerson({ dob: DateTime.fromObject({ year: 1971, month: 6, day: 1 }).toJSDate() })

    await deliusLogin(page)
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
    console.log(`CRN ${crn}, sentence and booking ${sentence.toISODate()}, release ${release.toISODate()}`)
    await createCustodialEvent(page, {
        crn,
        date: sentence.toJSDate(),
        event: {
            appearanceType: 'Sentence',
            outcome: 'Life imprisonment (Adult)',
            length: '300',
            lengthUnit: 'Months',
            secondLength: '300',
            secondLengthUnit: 'Months',
            mainOffence: 'Murder - 00100',
            plea: 'Guilty',
        },
    })

    await createLiferRegistration(page, crn, data.teams.genericTeam.provider)

    const { nomisId } = await createAndBookPrisoner(page, crn, person, 'SWI', sentence.set({ hour: 9 }))
    await findCustodyForEventByCRN(page, crn, 1)
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(1), {
        timeout: 180_000,
    })
    await releasePrisoner(nomisId, release)
    await refreshUntil(page, () => expect(page.locator("//span[contains(text(),'In the Community')]")).toHaveCount(1), {
        timeout: 180_000,
    })

    await expect(async () => {
        const context = await getSupervisionPackagesContext(crn)
        expect(context.liferCategory?.description).toBe('Lifer - Life Imprisonment')
        const event = context.sentences.find(item => item.eventNumber === '1')
        expect(event?.type.description).toBe('Life imprisonment (Adult)')
        expect(event?.startDate).toBe(sentence.toISODate())
        expect(event?.custody?.releases.map(item => item.releaseDate)).toContain(release.toISODate())
    }).toPass({ timeout: 180_000, intervals: [1000, 5000] })

    await oasysLogin(page, UserType.SupervisionPackages)
    await createLayer1CompleteAssessment(
        page,
        crn,
        person,
        nomisId,
        false,
        false,
        undefined,
        undefined,
        sentence.toJSDate()
    )
    await signAndlock(page)
})
