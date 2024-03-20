import { type Page, expect } from '@playwright/test'
import { login as approvedPremisesLogin, navigateToApplications } from '../login'
import { enterCRN } from './enter-crn'
import { clickSaveAndContinue } from './confirm-details'
import { clickExceptionalCaseYes } from './application-not-eligible'
import { addExemptionDetails } from './add-exemption-details'
import { selectSentenceType } from './select-sentence-type'
import { selectSituationOption } from './select-situation-option'
import { selectReleaseDateKnownStatus } from './release-date-known-status'
import { confirmPlacementStartdate } from './placement-start-date'
import { selectAPPlacementPurpose } from './ap-placement-purpose'
import { selectTypeOfAPRequired } from './select-type-ap-required'
import { enterSedLedPssDates, selectTransgenderStatus } from './select-transgender-status'
import { confirmYourDetails } from './confirm-your-details'
import {shortNoticeApplication} from "./short-notice-application.js";

export const clickTypeOfAPRequiredLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Type of AP required' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Which type of AP does')
}

export const clickChooseSectionsOfOASysToImportLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Choose sections of OASys to import' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'Which of the following sections of OASys do you want to import?'
    )
}

export const clickAddDetailsManagingRisksNeedsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Add detail about managing risks and needs' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'What features of an Approved Premises (AP) will support the management of risk?'
    )
}

export const clickreviewPrisoninformationLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Review prison information' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Prison information')
}

export const clickDescribeLocationFactorsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Describe location factors' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Location factors')
}

export const clickAddAccessCulturalHealthcareNeedsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Add access, cultural and healthcare needs' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Access, cultural and healthcare needs')
}

export const clickDtlFrtherConsidPlacementLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Detail further considerations for placement' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Further placement considerations')
    await expect(page.locator('#main-content h1')).toContainText('Room sharing')
}

export const clickAddMoveOnInfoLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Add move on information' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Placement duration and move on')
}

export const clickAttachRqrdDocumentsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Attach required documents' }).click()
    await expect(page.locator('#main-content h1')).toContainText(
        'Select any additional documents that are required to support your application'
    )
}

export const clickCheckYourAnswersLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Check your answers' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Check your answers')
}

export const verifyRoshScoresAreAsPerOasys = async (page: Page) => {
    await expect(page.locator(`td:right-of(:text-is("Children"))`).first()).toHaveText('Very high')
    await expect(page.locator(`td:right-of(:text-is("Public"))`).first()).toHaveText('Medium')
    await expect(page.locator(`td:right-of(:text-is("Known adult"))`).first()).toHaveText('High')
    await expect(page.locator(`td:right-of(:text-is("Staff"))`).first()).toHaveText('Medium')
}

export const navigateToTaskListPage = async (page: Page, crn: string) => {
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

    // And I confirm the user's details
    await confirmYourDetails(page)

    // And I say there no transgender history
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

    // And I confirm Short notice application status
    await shortNoticeApplication(page)

    // And I select "Public protection" as the purpose of the Approved Premises (AP) placement
    await selectAPPlacementPurpose(page)

    // And I click on Type Of AP Required Link
    await clickTypeOfAPRequiredLink(page)

    // And I select Type Of Approved Premises Required and Click on Submit
    await selectTypeOfAPRequired(page)
}
