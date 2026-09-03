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
    createLayer1AssessmentReview,
    completeSection1,
    completePredictorQuestions,
    completeSection2OffenceAnalysis,
    completeSelfAssessmentForm,
    completeSection1NoSexualOffence,
    clickSection1,
    clickRoSHSummary,
    clickRiskManagementPlan,
} from '../create-assessment'
import { completeReviewBasicSentencePlan } from '../basic-sentence-plan'
import { completeRoSHSection1MarkAllNo } from '../rosh-section-1'
import { clickSection2To4 } from '../rosh-section-2-4'
import { completeRoSHSection10RoSHSummary } from '../rosh-section-10'
import { completeRiskManagementPlan } from '../risk-management-plan'
import { completeRoSHSection9RoSHSummary } from '../rosh-section-9'
import { completeRoSHSection6 } from '../rosh-section-6'
import { completeRoSHSection5FullAnalysis } from '../../layer3-assessment/section-5'
import { completeRoSHSection8FullAnalysisYes } from '../rosh-section-8'
import { clickSection2To4RoshYes } from '../../layer3-assessment/section-2-4'

export const createLayer1CompleteAssessment = async (
    page: Page,
    crn: string,
    person: Person,
    nomisId?: string,
    highRoshScore: boolean = false,
    sexualOffence: boolean = false,
    offenceCode?: string,
    offenceSubCode?: string
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
    await clickSection1(page)
    if (sexualOffence) {
        await completeSection1(
            page,
            DateTime.fromJSDate(person.dob).plus({ years: 15 }).toJSDate(),
            offenceCode,
            offenceSubCode
        )
    } else {
        await completeSection1NoSexualOffence(page, DateTime.fromJSDate(person.dob).plus({ years: 15 }).toJSDate())
    }

    // And I complete section 2 and Click Save & Next
    await completeSection2OffenceAnalysis(page)
    // And I complete "Predictor Questions" and Click Save & Next
    await completePredictorQuestions(page)
    // And I complete "Self Assessment Form" and Click Save & Next
    await completeSelfAssessmentForm(page)
    // And I complete RoSH Screening Section 1 and Click Save & Next
    await completeRoSHSection1MarkAllNo(page)

    if (highRoshScore) {
        console.log('High RoSH Score is true')
        // And I Click on "RoSH Screening" - Section 2 to 4 & and Click Next without selecting/entering anything
        await clickSection2To4RoshYes(page, person)
        // And I complete "RoSH Screening" Section 5 and Click Save & Next
        await completeRoSHSection5FullAnalysis(page)
        // And I complete "RoSH Screening" Section 6 and Click Save & Next
        await completeRoSHSection6(page)
        // And I complete "'R8 Risks to the individual - full analysis'" and Click Save & Next
        await completeRoSHSection8FullAnalysisYes(page)
        // And I complete "RoSH Summary - R9" Questions and Click Save & Next
        await completeRoSHSection9RoSHSummary(page)
        // And I complete "RoSH Summary - R10" Questions and Click Save & Next
        await completeRoSHSection10RoSHSummary(page, highRoshScore)
    } else {
        console.log('High RoSH Score is false')
        // And I Click on "RoSH Screening" - Section 2 to 4 & and Click Next without selecting/entering anything
        await clickSection2To4(page, person)
        // And I complete "RoSH Screening" Section 5 and Click Save & Next
        await completeRoSHSection5FullAnalysis(page)
        // And I complete "RoSH Screening" Section 6 and Click Save & Next
        await completeRoSHSection6(page)
        // And I complete "RoSH Summary - R10" and Click Save & Next
        await clickRoSHSummary(page)
        await completeRoSHSection10RoSHSummary(page)
    }

    // And I complete "Risk Management Plan" Questions
    await clickRiskManagementPlan(page)
    await completeRiskManagementPlan(page)
    // And I complete "Review Sentence Plan" Questions
    await completeReviewBasicSentencePlan(page)
}
