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
    clickSection1,
    clickSection2to13,
    createLayer3Assessment,
    createLayer3AssessmentReview,
    selfAssessmentForm,
} from '../create-assessment'
import { completeRoSHSection1MarkAllNo } from '../section-1'
import { clickSection2To4, clickSection2To4NextButton } from '../section-2-4'
import { completeRoSHSection5FullAnalysis, completeRoSHSection5FullAnalysisYes } from '../section-5'
import { completeRoSHSection10RoSHSummary } from '../section-10'
import { completeRiskManagementPlan } from '../risk-management-plan'
import { completeOffenceAnalysis, completeOffenceAnalysisYes } from '../analysis-of-offences-layer3'
import { Person } from '../../../delius/utils/person'
import { completeRoSHSection9RoSHSummary } from './section-9'
import { completeReviewSentencePlan } from './review-sentenceplan'
import { addYears } from 'date-fns'
import { completeRoSHFullSec8RisksToIndvdl } from '../rosh-full-analysis-section8'

export const createLayer3CompleteAssessment = async (page: Page, crn: string, person: Person, nomisId?: string) => {
    let providerEstablishmentPageExists = false

    try {
        // Check if the 'Provider/Establishment' page exists within a timeout of 5000 milliseconds (5 seconds)
        await page.waitForSelector('#loginbodyheader > h2', { timeout: 5000 })
        providerEstablishmentPageExists =
            (await page.locator('#loginbodyheader > h2').innerText()) === 'Provider/Establishment'
    } catch {
        // If the element is not found within the timeout, set providerEstablishmentPageExists to false
        providerEstablishmentPageExists = false
    }

    // If the 'Provider/Establishment' page exists, select "Warwickshire" from Choose Provider Establishment
    if (providerEstablishmentPageExists) {
        await selectRegion(page)
    }

    // And I click on the Search button from the top menu
    await clickSearch(page)
    // And I enter the crn number and search
    await crnSearch(page, crn)
    // And I click on Create Offender button
    await clickCreateOffenderButton(page)
    if (nomisId !== undefined) {
        // Check if nomisId is provided
        await page.locator('#P10_CMS_PRIS_NUMBER').fill(nomisId)
        await page.locator('#B2777914628851790', { hasText: 'Save' }).click()
    }
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
    // And I complete section 1
    await clickSection1(page, addYears(person.dob, 15))
    // And I complete section 2 to 13
    await clickSection2to13(page)
    // And I Click on "RoSH Screening" Section
    await selfAssessmentForm(page)
    await clickRoSHScreeningSection1(page)
    // And I complete RoSH Screening Section 1 and Click Save & Next
    await completeRoSHSection1MarkAllNo(page)
    // And I Click on "RoSH Screening" - Section 2 to 4 & and Click Next without selecting/entering anything
    await clickSection2To4(page, person)
    // And I complete "RoSH Screening" Section 5 and Click Save & Next
    await completeRoSHSection5FullAnalysis(page)
    // And I Click on "RoSH Summary" Section
    await clickRoSHSummary(page)
    // And I complete "RoSH Summary - R9" Questions
    await completeRoSHSection9RoSHSummary(page)
    // And I complete "RoSH Summary - R10" Questions
    await completeRoSHSection10RoSHSummary(page)
    // And I Click on "Risk Management Plan" Section
    await clickRiskManagementPlan(page)
    // And I complete "Risk Management Plan" Questions
    await completeRiskManagementPlan(page)
    // And I complete "Review Sentence Plan" Questions
    await completeReviewSentencePlan(page)
    // And I click on "Section 2 to 13" & "2 - Offence Analysis"
    await clickOffenceAnalysis(page)
    // And I complete Offence Analysis Plan Questions
    await completeOffenceAnalysisYes(page)
}
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
    await clickCMSRecord(page)
    // And I update the offender
    await clickUpdateOffenderButton(page)
    // And I start creating Layer 3 Assessment
    await createLayer3AssessmentReview(page)
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
    await page.locator('a', { hasText: 'Section 2 to 13' }).click()
    await clickOffenceAnalysis(page)
    // And I complete Offence Analysis Plan Questions
    await completeOffenceAnalysis(page)
    // And I click on "Section 8" under Rosh Full Analysis
    await clickRoshFullRisksToIndividual(page)
    // And I complete "Risks to Individual(Risks to Self)" Section
    await completeRoSHFullSec8RisksToIndvdl(page)
}
