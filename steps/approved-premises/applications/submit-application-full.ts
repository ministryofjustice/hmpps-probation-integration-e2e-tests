import { expect, type Page } from '@playwright/test'
import { enterCRN } from './enter-crn.js'
import { clickSaveAndContinue } from './confirm-details.js'
import { clickExceptionalCaseYes } from './application-not-eligible.js'
import { selectSentenceType } from './select-sentence-type.js'
import { selectSituationOption } from './select-situation-option.js'
import { selectReleaseDateKnownStatus } from './release-date-known-status.js'
import { confirmPlacementStartdate } from './placement-start-date.js'
import { selectAPPlacementPurpose } from './ap-placement-purpose.js'
import {
    clickAddAccessCulturalHealthcareNeedsLink,
    clickAddDetailsManagingRisksNeedsLink,
    clickAddMoveOnInfoLink,
    clickAttachRqrdDocumentsLink,
    clickCheckYourAnswersLink,
    clickChooseSectionsOfOASysToImportLink,
    clickDescribeLocationFactorsLink,
    clickDtlFrtherConsidPlacementLink,
    clickreviewPrisoninformationLink,
    clickTypeOfAPRequiredLink,
} from './task-list.js'
import { selectTypeOfAPRequired } from './select-type-ap-required.js'
import { addExemptionDetails } from './add-exemption-details.js'
import { addRisksNeedsDetails } from './add-details-managing-risks-needs.js'
import { reviewPrisoninformation } from './review-prison-information.js'
import { addLocationFactors } from './location-factors.js'
import { addAccessCulturalHealthCareNeeds } from './access-cultural-healthcare-needs.js'
import { addFurtherPlacementConsiderations } from './futher-placement-considerations.js'
import { addMoveOnInformation } from './add-move-on-info.js'
import { attachReqrdDocuments } from './attach-required-documents.js'
import { checkYourAnswers } from './check-your-answers.js'
import { enterSedLedPssDates, selectTransgenderStatus } from './select-transgender-status.js'

export const submitAPApplication = async (page: Page, crn: string) => {
    // And I enter the CRN & Submit
    await enterCRN(page, crn)
    // And I click on Save and Continue confirming the offender's details
    await clickSaveAndContinue(page)
    // And I say this an exceptional case
    await clickExceptionalCaseYes(page)
    // And I say add the agreed date and exception details
    await addExemptionDetails(page)
    // And I select their transgender status
    await selectTransgenderStatus(page)
    // And I enter Sentence end date (SED), Licence end date (LED), Post-sentence supervision (PSS)
    await enterSedLedPssDates(page)
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
    // And I click on "Choose sections of OASys to import" link
    await clickChooseSectionsOfOASysToImportLink(page)
    for (let i = 0; i < 6; i++) {
        await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    }
    await expect(page.locator('#oasys-import-status')).toHaveText('Completed')
    // And I fill all the sections
    await clickAddDetailsManagingRisksNeedsLink(page)
    await addRisksNeedsDetails(page)
    await clickreviewPrisoninformationLink(page)
    await reviewPrisoninformation(page)
    await clickDescribeLocationFactorsLink(page)
    await addLocationFactors(page)
    await clickAddAccessCulturalHealthcareNeedsLink(page)
    await addAccessCulturalHealthCareNeeds(page)
    await clickDtlFrtherConsidPlacementLink(page)
    await addFurtherPlacementConsiderations(page)
    await clickAddMoveOnInfoLink(page)
    await addMoveOnInformation(page)
    await clickAttachRqrdDocumentsLink(page)
    await attachReqrdDocuments(page)
    await clickCheckYourAnswersLink(page)
    await checkYourAnswers(page)
    await page.getByLabel('I confirm the information provided is complete, accurate and up to date.').check()
    // Then I submit the application
    await page.locator('button', { hasText: 'Submit application' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Application confirmation')
    await page.locator('a', { hasText: 'Back to dashboard' }).click()
}
