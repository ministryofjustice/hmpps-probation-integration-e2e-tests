import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { data } from '../../test-data/test-data.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as approvedPremisesLogin } from '../../steps/approved-premises/login.js'
import { selectApprovedPremises } from '../../steps/approved-premises/approved-premises-home.js'
import { managePlacement, selectCreatePlacementAction } from '../../steps/approved-premises/approved-premises.js'
import { searchOffenderWithCrn } from '../../steps/approved-premises/create-placement.js'
import { createBooking } from '../../steps/approved-premises/create-booking.js'
import { clickBackToDashboard } from '../../steps/approved-premises/placement-confirmation.js'
import { selectMarkAsArrivedAction } from '../../steps/approved-premises/placement-details.js'
import { verifyKeyworkerAvailability } from '../../steps/approved-premises/mark-as-arrived.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'

const nomisIds = []

test('Create an approved premises booking', async ({ page }) => {
    //Given I login in to NDelius
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    // And I create an offender
    const crn = await createOffender(page, { person })
    // And I create an event in nDelius
    await createCustodialEvent(page, { crn })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    //When I log in to Approved Premises as a "DELIUS_LOGIN_USER" user
    await approvedPremisesLogin(page)
    // And I choose a premises # Choose the first premises in the list
    await selectApprovedPremises(page)
    // And I navigate to create a placement # Choose Actions > Create a placement
    await selectCreatePlacementAction(page)
    //And I search for the offender with CRN
    await searchOffenderWithCrn(page, crn)
    // When I create a booking in Approved Premises
    await createBooking(page)
    // And I click on "Back to dashboard" link
    await clickBackToDashboard(page)
    // And I select to manage the placement
    await managePlacement(page, crn)
    // And I click on the Search button from the top menu
    await selectMarkAsArrivedAction(page)
    // Then I should see the staff member in the list of Key Workers
    await verifyKeyworkerAvailability(
        page,
        `${data.staff.approvedPremisesKeyWorker.firstName} ${data.staff.approvedPremisesKeyWorker.lastName}`
    )
    // And I should see a contact in Delius for the booking ...
    // TODO this functionality is not available yet
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
