import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { login as hmppsLogin } from '../../steps/hmpps-auth/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { data } from '../../test-data/test-data.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import {login as approvedPremisesLogin, navigateToApplications} from '../../steps/approved-premises/login.js'
import { selectApprovedPremises } from '../../steps/approved-premises/approved-premises-home.js'
import { managePlacement, selectCreatePlacementAction } from '../../steps/approved-premises/approved-premises.js'
import { searchOffenderWithCrn } from '../../steps/approved-premises/create-placement.js'
import { createBooking } from '../../steps/approved-premises/create-booking.js'
import { clickBackToDashboard } from '../../steps/approved-premises/placement-confirmation.js'
import { selectMarkAsArrivedAction } from '../../steps/approved-premises/placement-details.js'
import { verifyKeyworkerAvailability } from '../../steps/approved-premises/mark-as-arrived.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import {submitAPApplication} from "../../steps/approved-premises/applications/submit-application-full.js";
import {login as oasysLogin} from "../../steps/oasys/login.js";
import {setProviderEstablishment as selectRegion} from "../../steps/oasys/set-provider-establishment.js";
import {clickSearch} from "../../steps/oasys/task-manager.js";
import {offenderSearchWithCRN as crnSearch} from "../../steps/oasys/offender-search.js";
import {clickCreateOffenderButton} from "../../steps/oasys/cms-offender-details.js";
import {
    clickCreateAssessmentButton,
    clickUpdateOffenderButton
} from "../../steps/oasys/layer3-assessment/create-ofender.js";
import {clickOKForCRNAmendment} from "../../steps/oasys/layer3-assessment/crn-amendment.js";
import {clickCMSRecord} from "../../steps/oasys/layer3-assessment/cms-search-results.js";
import {
    clickAccommodation, clickEducationTrainingEmpl,
    clickOffenceAnalysis, clickRelationships,
    clickRiskManagementPlan, clickRoshFullRisksToIndividual,
    clickRoSHScreeningSection1, clickRoSHSummary,
    createLayer3Assessment
} from "../../steps/oasys/layer3-assessment/create-assessment.js";
import {completeRoSHSection1MarkAllNo} from "../../steps/oasys/layer3-assessment/section-1.js";
import {clickSection2To4NextButton} from "../../steps/oasys/layer3-assessment/section-2-4.js";
import {completeRoSHSection5FullAnalysisYes} from "../../steps/oasys/layer3-assessment/section-5.js";
import {completeRoSHSection10RoSHSummary} from "../../steps/oasys/layer3-assessment/section-10.js";
import {completeRiskManagementPlan} from "../../steps/oasys/layer3-assessment/risk-management-plan.js";
import {completeOffenceAnalysis} from "../../steps/oasys/layer3-assessment/analysis-of-offences-layer3.js";
import {completeRoSHFullSec8RisksToIndvdl} from "../../steps/oasys/layer3-assessment/rosh-full-analysis-section-8.js";
import {completeAccommodationSection} from "../../steps/oasys/layer3-assessment/accommodation-section.js";
import {completeETESection} from "../../steps/oasys/layer3-assessment/ete-section.js";
import {completeRelationshipsSection} from "../../steps/oasys/layer3-assessment/relationships-section.js";


const nomisIds = []

test('Create an approved premises booking', async ({ page }) => {
    //Given I login in to NDelius
    await hmppsLogin(page)
    await deliusLogin(page)
    const person = deliusPerson()
    // And I create an offender
    const crn: string = await createOffender(page, { person, providerName: data.teams.allocationsTestTeam.provider })
    // And I create an event in nDelius
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    await oasysLogin(page)
    // And I select "Warwickshire" from Choose Provider Establishment
    await selectRegion(page)
    // And I click on the Search button from the top menu
    await clickSearch(page)
    // And I enter the crn number and search
    await crnSearch(page, crn)
    // And I click on Create Offender button
    await clickCreateOffenderButton(page)
    // And I click on Create Assessment Button
    await clickCreateAssessmentButton(page)
    // And I say OK for CRN Amendment
    await clickOKForCRNAmendment(page)
    // And I click on CMS Record
    await clickCMSRecord(page)
    // And I update the offender
    await clickUpdateOffenderButton(page)
    // And I start creating Layer 3 Assessment
    await createLayer3Assessment(page)
    // And I Click on "RoSH Screening" Section
    await clickRoSHScreeningSection1(page)
    // And I complete RoSH Screening Section 1 and Click Save & Next
    await completeRoSHSection1MarkAllNo(page)
    // And I Click on "RoSH Screening" - Section 2 to 4 & and Click Next without selecting/entering anything
    await clickSection2To4NextButton(page)
    // And I complete "RoSH Screening" Section 5 and Click Save & Next
    await completeRoSHSection5FullAnalysisYes(page)
    // And I Click on "RoSH Summary" Section
    await clickRoSHSummary(page)
    // And I complete "RoSH Summary - R10" Questions
    await completeRoSHSection10RoSHSummary(page)
    // And I Click on "Risk Management Plan" Section
    await clickRiskManagementPlan(page)
    // And I complete "Risk Management Plan" Questions
    await completeRiskManagementPlan(page)
    // And I click on "Section 2 to 13" & "2 - Offence Analysis"
    await clickOffenceAnalysis(page)
    // And I complete Offence Analysis Plan Questions
    await completeOffenceAnalysis(page)
    // And I click on "Section 8" under Rosh Full Analysis
    await clickRoshFullRisksToIndividual(page)
    // And I complete "Risks to Individual(Risks to Self)" Section
    await completeRoSHFullSec8RisksToIndvdl(page)
    // And I click on "Accommodation' under Section 2 to 4
    await clickAccommodation(page)
    // And I complete "Accommodation" Section
    await completeAccommodationSection(page)
    // And I click on 'ETE'(4 - Education, Training and Employability) under Section 2 to 4
    await clickEducationTrainingEmpl(page)
    // And I complete "Education, Training and Employability" Section
    await completeETESection(page)
    // And I click on "Relationships" under Section 2 to 4
    await clickRelationships(page)
    // And I complete "Relationships" Section
    await completeRelationshipsSection(page)
    //When I log in to Approved Premises as a "DELIUS_LOGIN_USER" user
    await approvedPremisesLogin(page)
    await navigateToApplications(page)
    // const crn = 'X629725'
    // And I submit the application for this CRN
    await submitAPApplication(page, crn)
    // And I log back to Approved Premises
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
