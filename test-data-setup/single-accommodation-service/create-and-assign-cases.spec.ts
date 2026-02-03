import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, updateCustodyDates } from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { signAndlock } from '../../steps/oasys/layer3-assessment/sign-and-lock'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { formatDate, NextMonth } from '../../steps/delius/utils/date-time'

test.describe(() => {
    test.describe.configure({ retries: 0 })

    test('Create and assign cases', async ({ page }) => {
        await loginDelius(page)

        const person = deliusPerson({ sex: 'Male', dob: null, lastName: null, firstName: null })
        console.log('Creating offender...')
        const crn: string = await createOffender(page, {
            person,
            providerName: data.teams.singleAccommodationTestTeam.provider,
        })
        console.log('OK \n----------')

        // console.log('Creating custodial event...')
        // await createCustodialEvent(page, { crn, allocation: { team: data.teams.singleAccommodationTestTeam } })
        // console.log('OK \n----------')

        console.log('Creating booking...')
        const { bookingId } = await createAndBookPrisoner(page, crn, person)
        console.log('OK \n----------')

        console.log('Creating OASys assessment...')
        await oasysLogin(page, UserType.Booking)
        await createLayer3CompleteAssessment(page, crn, person, 'Yes')
        await signAndlock(page)
        console.log('OK \n----------')

        console.log('Updating custody dates...')
        await updateCustodyDates(bookingId, { conditionalReleaseDate: formatDate(NextMonth.toJSDate(), 'yyyy-MM-dd') })
        console.log('OK \n----------')

        console.log('Assigning case to AccommodationTestUser...')
        await loginDelius(page)
        const assignedTo = await internalTransfer(page, {
            crn,
            allocation: { staff: data.staff.singleAccommodationTestUser, team: data.teams.singleAccommodationTestTeam },
        })
        console.log(`Case assigned to ${assignedTo}`)
        console.log('OK \n----------')
    })
})
