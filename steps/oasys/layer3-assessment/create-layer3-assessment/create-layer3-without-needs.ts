import { type Page } from '@playwright/test'
import { setProviderEstablishment as selectRegion } from '../../set-provider-establishment.js'
import { clickSearch } from '../../task-manager.js'
import { offenderSearchWithCRN as crnSearch } from '../../offender-search.js'
import { clickCreateOffenderButton } from '../../cms-offender-details.js'
import { clickCreateAssessmentButton, clickUpdateOffenderButton } from '../create-ofender.js'
import { clickOKForCRNAmendment } from '../crn-amendment.js'
import { clickCMSRecord } from '../cms-search-results.js'
import {
    clickOffenceAnalysis,
    clickRiskManagementPlan,
    clickRoshFullRisksToIndividual,
    clickRoSHScreeningSection1,
    clickRoSHSummary,
    createLayer3Assessment,
} from '../create-assessment.js'
import { completeRoSHSection1MarkAllNo } from '../section-1.js'
import { clickSection2To4NextButton } from '../section-2-4.js'
import { completeRoSHSection5FullAnalysisYes } from '../section-5.js'
import { completeRoSHSection10RoSHSummary } from '../section-10.js'
import { completeRiskManagementPlan } from '../risk-management-plan.js'
import { completeOffenceAnalysis } from '../analysis-of-offences-layer3.js'
import { completeRoSHFullSec8RisksToIndvdl } from '../rosh-full-analysis-section-8.js'

export const createLayer3AssessmentWithoutNeeds = async (page: Page, crn: string) => {


    // And I select "Warwickshire" from Choose Provider Establishment
    await selectRegion(page)
    // And I click on the Search button from the top menu
    await clickSearch(page)
    // And I enter the crn number and search
    await crnSearch(page, crn)

    // const crn = 'X609269'

    // await page.getByLabel('Open Existing Offender').click()
    // await page.locator('button', { hasText: 'Open Existing Offender' }).click()
    await page.locator('#B74262616222222107').click()
    // await page.locator('#B2799414815519187').click()

    // await page.locator('#report_R6586767371592399 > tbody > tr').click()
    // await page.locator('#report_R5522906992105444 > tbody > tr').click()

    //
    //
    // // And I click on Create Offender button
    // await clickCreateOffenderButton(page)
    // // And I click on Create Assessment Button
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
    // await clickRoshFullRisksToIndividual(page)
    // And I complete "Risks to Individual(Risks to Self)" Section
    // await completeRoSHFullSec8RisksToIndvdl(page)
}
