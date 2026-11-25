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
import { login as managePeopleOnProbationLogin } from '../../steps/manage-a-supervision/login'
import { searchPersonInMPoP } from '../../steps/manage-a-supervision/application'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer1CompleteAssessment } from '../../steps/oasys/layer1-assessment/create-layer1-assessment/create-layer1-assessment'
import { signAndlock } from '../../steps/oasys/layer1-assessment/sign-and-lock'
import { data } from '../../test-data/test-data'


// op run --account ministryofjustice.1password.eu --env-file=./.env.1password -- \
//   env TEST_DIR=./test-data-setup OASYS_ROSH=low npx playwright test supervision-packages-cases/create-lifer-cases.spec.ts \
//   -g 6 --headed
// Set OASYS_ROSH to high for a high RoSH assessment; it defaults to low.
const rosh = process.env.OASYS_ROSH ?? 'low'
if (rosh !== 'low' && rosh !== 'high') {
    throw new Error('OASYS_ROSH must be either low or high')
}

for (const yearsSinceRelease of [0, 1, 2, 3, 4, 5, 6, 9]) {
    test(`Create a ${rosh}-risk lifer released ${yearsSinceRelease} years ago`, async ({ page }) => {
        slow(12)
        const now = DateTime.now().setZone('Europe/London').startOf('day')
        const release = now.minus({ days: 1, years: yearsSinceRelease }).set({ hour: 12 })
        const sentence = release.minus({ years: 1 }).startOf('day')
        const person = deliusPerson({ dob: now.minus({ years: 55 }).toJSDate() })

        await deliusLogin(page)
        const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
        console.log(`Lifer released ${yearsSinceRelease} years ago: CRN ${crn}, release date ${release.toISODate()}`)
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

        const { nomisId } = await createAndBookPrisoner(page, crn, person, 'SWI', sentence.plus({ hours: 9 }))
        await findCustodyForEventByCRN(page, crn, 1)
        await refreshUntil(
            page,
            () => expect(page.locator("//span[contains(text(),'Swansea (HMP)')]")).toHaveCount(1),
            {
                timeout: 180_000,
            }
        )
        await releasePrisoner(nomisId, release)
        await refreshUntil(
            page,
            () => expect(page.locator("//span[contains(text(),'In the Community')]")).toHaveCount(1),
            {
                timeout: 180_000,
            }
        )

        await expect(async () => {
            const context = await getSupervisionPackagesContext(crn)
            expect(context.liferCategory?.description).toBe('Lifer - Life Imprisonment')
            const event = context.sentences.find(item => item.eventNumber === '1')
            expect(event?.type.description).toBe('Life imprisonment (Adult)')
            expect(event?.custody?.releases.map(item => item.releaseDate)).toContain(release.toISODate())
        }).toPass({ timeout: 180_000, intervals: [1000, 5000] })

        await oasysLogin(page, UserType.SupervisionPackages)
        await createLayer1CompleteAssessment(
            page,
            crn,
            person,
            nomisId,
            rosh === 'high',
            false,
            undefined,
            undefined,
            sentence.toJSDate()
        )
        await signAndlock(page)

        // await managePeopleOnProbationLogin(page)
        // await searchPersonInMPoP(page, crn)
        // const tier = 'E'
        // await refreshUntil(
        //     page,
        //     () =>
        //         expect(page.getByRole('main').getByRole('link', { name: `Tier: ${tier}`, exact: true })).toBeVisible(),
        //     { timeout: 180_000 }
        // )
        console.log(`Lifer released ${yearsSinceRelease} years ago: CRN ${crn}, sentence and booking ${sentence.toISODate()}, release ${release.toISODate()}`)
    })
}
