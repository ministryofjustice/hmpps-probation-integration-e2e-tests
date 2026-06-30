import { expect, type Page } from '@playwright/test'
import { enterCRN } from './enter-crn'
import { selectSentenceType } from './select-sentence-type'
import { selectSituationOption } from './select-situation-option'
import { selectReleaseDateKnownStatus } from './release-date-known-status'
import { confirmPlacementStartdate } from './placement-start-date'
import { selectAPPlacementPurpose } from './ap-placement-purpose'
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
} from './task-list'
import { selectTypeOfAPRequired } from './select-type-ap-required'
import { addRisksNeedsDetails } from './add-details-managing-risks-needs'
import { reviewPrisoninformation } from './review-prison-information'
import { addLocationFactors } from './location-factors'
import { addAccessCulturalHealthCareNeeds } from './access-cultural-healthcare-needs'
import { addFurtherPlacementConsiderations } from './futher-placement-considerations'
import { addMoveOnInformation } from './add-move-on-info'
import { attachReqrdDocuments } from './attach-required-documents'
import { checkYourAnswers } from './check-your-answers'
import { enterSedLedPssDates, selectTransgenderStatus } from './select-transgender-status'
import { confirmYourDetails } from './confirm-your-details'
import { applicationOutsideNSTimescales } from './application-outside-national-standards'
import { selectOffence } from './select-offence'
import { selectAPPlacingReason } from './select-ap-placing-reason'

export const submitAPApplication = async (page: Page, crn: string) => {
    // And I enter the CRN & Submit
    await enterCRN(page, crn)
    // And I select the offence
    await selectOffence(page)
    // And I confirm the user's details
    await confirmYourDetails(page)
    // And I select their transgender status
    await selectTransgenderStatus(page)
    // And I enter Sentence end date (SED), Licence end date (LED), Post-sentence supervision (PSS)
    await enterSedLedPssDates(page)
    // And I select Sentence Type and click on Submit
    await selectSentenceType(page)
    // I select Approved Premises Placing reason
    await selectAPPlacingReason(page)
    // And I select that I know release date
    await selectReleaseDateKnownStatus(page)
    // And I confirm short notice application status
    await confirmPlacementStartdate(page)
    // And I select the reason for application being submitted outside of National Standards timescales
    await applicationOutsideNSTimescales(page)
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
