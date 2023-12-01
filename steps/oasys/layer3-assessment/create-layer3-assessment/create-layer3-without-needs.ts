import { type Page } from '@playwright/test'
import { setProviderEstablishment as selectRegion } from '../../set-provider-establishment'
import { clickSearch } from '../../task-manager'
import { offenderSearchWithCRN as crnSearch } from '../../offender-search'
import { clickCreateOffenderButton } from '../../cms-offender-details'
import { clickCreateAssessmentButton, clickUpdateOffenderButton } from '../create-ofender'
import { clickOKForCRNAmendment } from '../crn-amendment'
import { clickCMSRecord } from '../cms-search-results'
import {
    clickOffenceAnalysis,
    clickRiskManagementPlan,
    clickRoshFullRisksToIndividual,
    clickRoSHScreeningSection1,
    clickRoSHSummary,
    createLayer3Assessment,
} from '../create-assessment'
import { completeRoSHSection1MarkAllNo } from '../section-1'
import { clickSection2To4NextButton } from '../section-2-4'
import { completeRoSHSection5FullAnalysisYes } from '../section-5'
import { completeRoSHSection10RoSHSummary } from '../section-10'
import { completeRiskManagementPlan } from '../risk-management-plan'
import { completeOffenceAnalysis } from '../analysis-of-offences-layer3'
import { completeRoSHFullSec8RisksToIndvdl } from '../rosh-full-analysis-section-8'

export const createLayer3AssessmentWithoutNeeds = async (page: Page, crn: string) => {
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
    await clickCMSRecord(page, 10000)
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
}
