import { type Page } from '@playwright/test'
import { setProviderEstablishment as selectRegion } from '../../set-provider-establishment'
import { clickSearch } from '../../task-manager'
import { offenderSearchWithCRN as crnSearch } from '../../offender-search'
import { clickCreateOffenderButton } from '../../cms-offender-details'
import { Person } from '../../../delius/utils/person'
import { DateTime } from 'luxon'
import { clickCreateAssessmentButton, clickUpdateOffenderButton } from '../../layer3-assessment/create-ofender'
import { clickOKForCRNAmendment } from '../../layer3-assessment/crn-amendment'
import { clickCMSRecord } from '../../layer3-assessment/cms-search-results'
import {
    clickOffenceAnalysis,
    clickRiskManagementPlan,
    clickRoSHScreeningSection1,
    clickRoSHSummary,
    clickSection1,
    completeOffenceAnalysisAndPredictorQuestions,
    createLayer1AssessmentReview,
    selfAssessmentForm,
} from '../../layer3-assessment/create-assessment'
import { completeRoSHSection1MarkAllNo } from '../../layer3-assessment/section-1'
import { clickSection2To4, clickSection2To4RoshYes } from '../../layer3-assessment/section-2-4'
import { completeRoSHSection5FullAnalysis } from '../../layer3-assessment/section-5'
import { completeRoSHSection8FullAnalysisYes } from '../../layer3-assessment/section-8'
import { completeRoSHSection9RoSHSummary } from '../../layer3-assessment/create-layer3-assessment/section-9'
import { completeRoSHSection10RoSHSummary } from '../../layer3-assessment/section-10'
import { completeRiskManagementPlan } from '../../layer3-assessment/risk-management-plan'
import { completeReviewSentencePlan } from '../../layer3-assessment/create-layer3-assessment/review-sentenceplan'
import { completeOffenceAnalysisYes } from '../../layer3-assessment/analysis-of-offences-layer3'

export const createLayer1CompleteAssessment = async (
    page: Page,
    crn: string,
    person: Person,
    nomisId?: string,
    highRoshScore: boolean = false
) => {
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
    // And I start creating Layer 1 Assessment
    await createLayer1AssessmentReview(page)
    // And I complete section 1
    await clickSection1(page, DateTime.fromJSDate(person.dob).plus({ years: 15 }).toJSDate())
    // And I complete section 2 and predictor questions
    await completeOffenceAnalysisAndPredictorQuestions(page)
    // And I Click on "RoSH Screening" Section
    await selfAssessmentForm(page)
    await clickRoSHScreeningSection1(page)
    // And I complete RoSH Screening Section 1 and Click Save & Next
    await completeRoSHSection1MarkAllNo(page)

    if (highRoshScore) {
        console.log('High RoSH Score is true')
        // And I Click on "RoSH Screening" - Section 2 to 4 & and Click Next without selecting/entering anything
        await clickSection2To4RoshYes(page, person)
        // // And I complete "RoSH Screening" Section 5 and Click Save & Next
        await completeRoSHSection5FullAnalysis(page)
        // And I complete "'R8 Risks to the individual - full analysis'" Section 5 and Click Save & Next
        await completeRoSHSection8FullAnalysisYes(page)
        // And I complete "RoSH Summary - R9" Questions
        await completeRoSHSection9RoSHSummary(page)
        // And I complete "RoSH Summary - R10" Questions
        await completeRoSHSection10RoSHSummary(page, highRoshScore)
    } else {
        console.log('High RoSH Score is false')
        // And I Click on "RoSH Screening" - Section 2 to 4 & and Click Next without selecting/entering anything
        await clickSection2To4(page, person)
        // // And I complete "RoSH Screening" Section 5 and Click Save & Next
        await completeRoSHSection5FullAnalysis(page)
        // And I Click on "RoSH Summary" Section
        await clickRoSHSummary(page)
        // And I complete "RoSH Summary - R9" Questions
        await completeRoSHSection9RoSHSummary(page)
        // And I complete "RoSH Summary - R10" Questions
        await completeRoSHSection10RoSHSummary(page)
    }

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
