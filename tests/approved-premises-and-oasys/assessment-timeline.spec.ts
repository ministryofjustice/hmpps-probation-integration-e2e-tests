import { test } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config() // read environment variables into process.env
import { login as deliusLogin } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as oasysLogin } from '../../steps/oasys/login.js'
import { setProviderEstablishment as selectRegion } from '../../steps/oasys/set-provider-establishment.js'
import { clickSearch } from '../../steps/oasys/task-manager.js'
import { offenderSearchWithCRN as crnSearch } from '../../steps/oasys/offender-search.js'
import { clickCreateOffenderButton } from '../../steps/oasys/cms-offender-details.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import {
    clickCreateAssessmentButton,
    clickUpdateOffenderButton,
} from '../../steps/oasys/layer3-assessment/create-ofender.js'
import { clickOKForCRNAmendment } from '../../steps/oasys/layer3-assessment/crn-amendment.js'
import {
    clickAccommodation,
    clickEducationTrainingEmpl,
    clickOffenceAnalysis,
    clickRelationships,
    clickRiskManagementPlan,
    clickRoshFullRisksToIndividual,
    clickRoSHScreeningSection1,
    clickRoSHSummary,
    createLayer3Assessment,
} from '../../steps/oasys/layer3-assessment/create-assessment.js'
import { clickCMSRecord } from '../../steps/oasys/layer3-assessment/cms-search-results.js'
import { login as approvedPremisesLogin, navigateToApplications } from '../../steps/approved-premises/login.js'
import { enterCRN } from '../../steps/approved-premises/applications/enter-crn.js'
import { clickSaveAndContinue } from '../../steps/approved-premises/applications/confirm-details.js'
import { selectSentenceType } from '../../steps/approved-premises/applications/select-sentence-type.js'
import { selectReleaseDateKnownStatus } from '../../steps/approved-premises/applications/release-date-known-status.js'
import { selectAPPlacementPurpose } from '../../steps/approved-premises/applications/ap-placement-purpose.js'
import { selectSituationOption } from '../../steps/approved-premises/applications/select-situation-option.js'
import { confirmPlacementStartdate } from '../../steps/approved-premises/applications/placement-start-date.js'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import {
    clickChooseSectionsOfOASysToImportLink,
    clickTypeOfAPRequiredLink,
    verifyRoshScoresAreAsPerOasys,
} from '../../steps/approved-premises/applications/apply-for-ap-placement.js'
import { selectTypeOfAPRequired } from '../../steps/approved-premises/applications/select-type-ap-required.js'
import { completeRoSHSection1MarkAllNo } from '../../steps/oasys/layer3-assessment/section-1.js'
import { clickSection2To4NextButton } from '../../steps/oasys/layer3-assessment/section-2-4.js'
import { completeRoSHSection5FullAnalysisYes } from '../../steps/oasys/layer3-assessment/section-5.js'
import { completeRoSHSection10RoSHSummary } from '../../steps/oasys/layer3-assessment/section-10.js'
import { selectNeedsAndSubmit } from '../../steps/approved-premises/applications/import-oasys-sections.js'
import { verifyRoSHSummaryIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-rosh.js'
import { data } from '../../test-data/test-data.js'
import { completeRiskManagementPlan } from '../../steps/oasys/layer3-assessment/risk-management-plan.js'
import { verifyRMPInfoIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-rmp.js'
import { completeOffenceAnalysis } from '../../steps/oasys/layer3-assessment/analysis-of-offences-layer3.js'
import { verifyOffenceAnalysisIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-offence-analysis.js'
import { completeRoSHFullSec8RisksToIndvdl } from '../../steps/oasys/layer3-assessment/rosh-full-analysis-section-8.js'
import { verifyRiskToSelfIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-risk-to-self.js'
import { completeAccommodationSection } from '../../steps/oasys/layer3-assessment/accommodation-section.js'
import { completeETESection } from '../../steps/oasys/layer3-assessment/ete-section.js'
import { completeRelationshipsSection } from '../../steps/oasys/layer3-assessment/relationships-section.js'
import { verifySupportingInfoIsAsPerOASys } from '../../steps/approved-premises/applications/edit-risk-information-supporting-info.js'
import { clickExceptionalCaseYes } from '../../steps/approved-premises/applications/application-not-eligible.js'
import { addExemptionDetails } from '../../steps/approved-premises/applications/add-exemption-details.js'

const nomisIds = []
test('Create a Layer 3 Assessment in OASys and verify this assessments can be read by Approved Premises', async ({
    page,
}) => {
    test.skip()
    // Given I create new Offender in nDelius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    // And I create an event in nDelius
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    // And I create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)
    // And I log in to OASys as a "OASYS_T2_LOGIN_USER" user
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
    // When I login in to Approved Premises
    await approvedPremisesLogin(page)
    // And I navigate to AP Applications
    await navigateToApplications(page)
    // And I enter the CRN & Submit
    await enterCRN(page, crn)
    // And I click on Save and Continue confirming the offender's details
    await clickSaveAndContinue(page)
    // And I say this an exceptional case
    await clickExceptionalCaseYes(page)
    // And I say add the agreed date and exception details
    await addExemptionDetails(page)
    // And I select Sentence Type and click on Submit
    await selectSentenceType(page)
    // And I select "Referral for risk management" Option that describes the situation
    await selectSituationOption(page)
    // And I select that I know release date
    await selectReleaseDateKnownStatus(page)
    // And I confirm placement start date is same as release date
    await confirmPlacementStartdate(page)
    // And I select "Public protection" as the purpose of the Approved Premises (AP) placement
    await selectAPPlacementPurpose(page)
    // And I click on Type Of AP Required Link
    await clickTypeOfAPRequiredLink(page)
    // And I select Type Of Approved Premises Required and Click on Submit
    await selectTypeOfAPRequired(page)
    // And I Verify that the "RoSH Risk scores" in the RoSH Widget are as per OASys
    await verifyRoshScoresAreAsPerOasys(page)
    // And I click on "Choose sections of OASys to import" link
    await clickChooseSectionsOfOASysToImportLink(page)
    // And I select the "Needs" related to the offender
    await selectNeedsAndSubmit(page)
    // Then I verify that "RoSH Summary" information is as per the OASys
    await verifyRoSHSummaryIsAsPerOASys(page)
    // And I verify the "Risk Management Plan" information is as per the OASys
    await verifyRMPInfoIsAsPerOASys(page)
    // And I verify the "Offence Analysis" information is as per the OASys
    await verifyOffenceAnalysisIsAsPerOASys(page)
    // And I verify the "Risk to Self" information is as per the OASys
    await verifyRiskToSelfIsAsPerOASys(page)
    // And I verify the "Supporting Information" is as per the OASys
    await verifySupportingInfoIsAsPerOASys(page)
    // Todo - Fix this test once the Approved Premises have fixed the bug
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
