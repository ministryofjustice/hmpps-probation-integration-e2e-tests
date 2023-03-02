  import { type Page, expect } from '@playwright/test'
import { splitDate } from '../../common/common.js'
import { Yesterday } from '../../delius/utils/date-time.js'
import { faker } from '@faker-js/faker'
  import {navigateToApplications} from "../login.js";
  import {enterCRN} from "./enter-crn.js";
  import {clickSaveAndContinue} from "./confirm-details.js";
  import {clickExceptionalCaseYes} from "./application-not-eligible.js";
  import {selectSentenceType} from "./select-sentence-type.js";
  import {selectSituationOption} from "./select-situation-option.js";
  import {selectReleaseDateKnownStatus} from "./release-date-known-status.js";
  import {confirmPlacementStartdate} from "./placement-start-date.js";
  import {selectAPPlacementPurpose} from "./ap-placement-purpose.js";
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
    verifyRoshScoresAreAsPerOasys
} from "./task-list.js";
  import {selectTypeOfAPRequired} from "./select-type-ap-required.js";
  import {selectNeedsAndSubmit} from "./import-oasys-sections.js";
  import {verifyRoSHSummaryIsAsPerOASys} from "./edit-risk-information-rosh.js";
  import {verifyRMPInfoIsAsPerOASys} from "./edit-risk-information-rmp.js";
  import {verifyOffenceAnalysisIsAsPerOASys} from "./edit-risk-information-offence-analysis.js";
  import {verifyRiskToSelfIsAsPerOASys} from "./edit-risk-information-risk-to-self.js";
  import {verifySupportingInfoIsAsPerOASys} from "./edit-risk-information-supporting-info.js";
  import {addExemptionDetails} from "./add-exemption-details.js";
  import {addRisksNeedsDetails} from "./add-details-managing-risks-needs.js";
  import {reviewPrisoninformation} from "./review-prison-information.js";
  import {addLocationFactors} from "./location-factors.js";
  import {addAccessCulturalHealthCareNeeds} from "./access-cultural-healthcare-needs.js";
  import {addFurtherPlacementConsiderations} from "./futher-placement-considerations.js";
  import {addMoveOnInformation} from "./add-move-on-info.js";
  import {attachReqrdDocuments} from "./attach-required-documents.js";
  import {checkYourAnswers} from "./check-your-answers.js";

const [agreedDay, agreedMonth, agreedYear] = splitDate(Yesterday)

export const submitAPApplication = async (page: Page, crn: string) => {
    // And I navigate to AP Applications
    // await navigateToApplications(page)
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
    // And I click on "Choose sections of OASys to import" link
    await clickChooseSectionsOfOASysToImportLink(page)
    // const saveAndContinueButton = await page.locator('.govuk-button', { hasText: 'Save and continue' });
    // const saveAndContinueButton = page.locator('.govuk-button');
    // await saveAndContinueButton.click(); // click the button once
    // click the saveAndContinue button 5 times to import all the OASys sections
    // await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    for (let i = 0; i < 6; i++) {
        // await saveAndContinueButton.click();

        await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    }
    await expect(page.locator('#oasys-import-status')).toHaveText("Completed")
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
    // Then I submit the appplication
    await page.locator('button', { hasText: 'Submit application' }).click();
    await expect(page.locator('#main-content h1')).toContainText('Application confirmation')
}
