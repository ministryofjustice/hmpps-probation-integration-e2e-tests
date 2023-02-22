import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import { data } from '../../test-data/test-data.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { startUPWAssessmentFromDelius } from '../../steps/delius/upw/start-upw-assessment.js'
import { login as unpaidWorkLogin } from '../../steps/unpaidwork/login.js'
import { completeIndividualDetailsSection } from '../../steps/unpaidwork/individuals-details.js'
import {
    clickCaringCommitmentsLink,
    clickCulturalReligiousAdjustmentsLink, clickDisabilitiesAndMentalHealthLink,
    clickGenderInformationLink, clickGPDetailsLink, clickHealthIssuesLink,
    clickIndividualDetailsLink,
    clickManagingRiskLink,
    clickPlacementPreferencesLink,
    clickRiskOfHarmCommunityLink, clickTravelInformationLink,
} from '../../steps/unpaidwork/task-list.js'
import { completeGenderInformationSection } from '../../steps/unpaidwork/gender-information.js'
import { completeCulturalReligiousAdjustmentsSection } from '../../steps/unpaidwork/cultural-and-religious-adjustments.js'
import { completePlacementPreferencesSection } from '../../steps/unpaidwork/placement-preferences.js'
import { completeRiskHarmCommunitySection } from '../../steps/unpaidwork/risk-of-harm-community.js'
import { completeManagingRiskSection } from '../../steps/unpaidwork/managing-risk.js'
import {completeHealthIssuesSection} from "../../steps/unpaidwork/health-issues.js";
import {completeDisabilitiesAndMentalHealthSection} from "../../steps/unpaidwork/disabilities-and-mental-health.js";
import {completeCaringCommitmentsSection} from "../../steps/unpaidwork/caring-commitments.js";
import {completeTravelInformationSection} from "../../steps/unpaidwork/travel-information.js";
import {completeGPDetails} from "../../steps/unpaidwork/gp-details.js";

const nomisIds = []
test('Create a UPW-Assessment from Delius and verify the Pdf is uploaded back to Delius', async ({ page }) => {
    test.skip()
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    // And I create Supervision Community Event in Delius
    await createCommunityEvent(page, {
        crn,
        allocation: { team: data.teams.allocationsTestTeam, staff: data.staff.allocationsTester2 },
    })
    // And I add a requirement for this event with the type called "unpaid work"
    await createRequirementForEvent(page, { crn, requirement: data.requirements.unpaidWork })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    // And I start UPW Assessment from Delius
    const popup = await startUPWAssessmentFromDelius(page)
    // When I login to UPW and navigate to UPW Task List
    await unpaidWorkLogin(popup)
    // And I click on "Individual's details" link
    await clickIndividualDetailsLink(popup)
    // And I complete "Individual's details" Section
    await completeIndividualDetailsSection(popup)
    // And I click on "Gender information" link
    await clickGenderInformationLink(popup)
    // And I complete "Gender information" Section
    await completeGenderInformationSection(popup)
    // And I click on "Cultural and Religious Adjustments" link
    await clickCulturalReligiousAdjustmentsLink(popup)
    // And I complete "Cultural and Religious Adjustments" Section
    await completeCulturalReligiousAdjustmentsSection(popup)
    // And I click on "Placement preferencesCOMPLETED" link
    await clickPlacementPreferencesLink(popup)
    // And I complete "Placement preferencesCOMPLETED" Section
    await completePlacementPreferencesSection(popup)
    // And I click on "Risk of harm in the community" link
    await clickRiskOfHarmCommunityLink(popup)
    // And I complete "Risk of harm in the community" Section
    await completeRiskHarmCommunitySection(popup)
    // And I click on "Managing risk" link
    await clickManagingRiskLink(popup)
    // And I complete "Managing risk" Section
    await completeManagingRiskSection(popup)
    // And I click on "Health Issues" link
    await clickHealthIssuesLink(page)
    // And I complete "Health Issues" Section
    await completeHealthIssuesSection(page)
    // And I click on "Disabilities and Mental Health" link
    await clickDisabilitiesAndMentalHealthLink(page)
    // And I complete "Disabilities and Mental Health" Section
    await completeDisabilitiesAndMentalHealthSection(page)
    // And I click on "Caring commitments" link
    await clickCaringCommitmentsLink(page)
    // And I complete "Caring commitments" Section
    await completeCaringCommitmentsSection(page)
    // And I click on "Travel" link
    await clickTravelInformationLink(page)
    // And I complete "Travel information" Section
    await completeTravelInformationSection(page)
    // And I click on "GP details" link
    await clickGPDetailsLink(page)
    // And I complete "GP details" Section
    await completeGPDetails(page)

})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
