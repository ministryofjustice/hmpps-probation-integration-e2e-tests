import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {getDate, getMonth, getYear, addMonths, addDays} from 'date-fns'

export async function submitCAS3Referral(page: Page, crn: string) {
    await startApplication(page)
    await searchForPerson(page, crn)
    await addSentenceInformation(page)
    await enterContactDetails(page)
    await confirmEligibility(page)
    await confirmConsent(page)
    await enterLicenceConditions(page)
    await reviewPrisonInformation(page)
    await enterPlacementConsiderations(page)
    await enterApprovalsForSpecificRisks(page)
    await outlineBehaviourInCAS(page)
    await confirmPlacementLocation(page)
    await addDisabilityCulturalAndSpecificNeeds(page)
    await addInformationOnSafeguardingAndSupport(page)
    await provideFoodAllergies(page)
    await outlineMoveOnPlan(page)
    await enterAccommodationReferralDetails(page)
    await checkAnswers(page)
    await submitReferral(page)
    await expect(page.getByRole('heading', { name: 'Referral complete' })).toBeVisible()
}

async function startApplication(page: Page) {
    await page.getByRole('button', { name: 'Start now' }).click()
    await expect(page).toHaveTitle('Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)')
    await page.getByRole('button', { name: 'Start now' }).click()
}

async function searchForPerson(page: Page, crn: string) {
    await page.getByLabel("Enter the person's CRN").fill(crn)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Confirm the person's details - Transitional Accommodation (CAS3)")
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
}

async function addSentenceInformation(page: Page) {
    await page.getByRole('link', { name: 'Add sentence information' }).click()
    await expect(page).toHaveTitle("Provide a brief summary of the person's index offence(s) and offending history - Transitional Accommodation (CAS3)")
    await page.getByLabel("Provide details").fill("Test summary of person's index offence(s) and offending history any history of arson, violent offences, weapons etc")
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Which of the following best describes the sentence type? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'Standard determinate custody', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("What is the sentence length? - Transitional Accommodation (CAS3)")
    await page.getByLabel("Years").fill(String(0))
    await page.getByLabel("Months").fill(String(6))
    await page.getByLabel("Weeks").fill(String(1))
    await page.getByLabel("Days").fill(String(1))
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Sentence expiry date - Transitional Accommodation (CAS3)")
    await page.getByLabel("Day").fill(getDate(addMonths(new Date(), 6)).toString());
    await page.getByLabel("Month").fill((getMonth(addMonths(new Date(), 6)) + 1).toString());
    await page.getByLabel("Year").fill(getYear(addMonths(new Date(), 6)).toString());
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("What is the release type? - Transitional Accommodation (CAS3)")
    await page.getByRole('checkbox', { name: 'Licence', exact: true }).check()
    await page.locator('#licenceStartDate-day').fill(getDate(addDays(new Date(), 10)).toString());
    await page.locator('#licenceStartDate-month').fill((getMonth(addDays(new Date(), 10)) + 1).toString());
    await page.locator('#licenceStartDate-year').fill(getYear(addDays(new Date(), 10)).toString());
    await page.locator('#licenceEndDate-day').fill(getDate(addMonths(new Date(), 6)).toString());
    await page.locator('#licenceEndDate-month').fill((getMonth(addMonths(new Date(), 6)) + 1).toString());
    await page.locator('#licenceEndDate-year').fill(getYear(addMonths(new Date(), 6)).toString());
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#sentence-information-status')).toHaveText('Completed')
}

async function enterContactDetails(page: Page) {
    await page.getByRole('link', { name: 'Enter contact details' }).click()
    await expect(page).toHaveTitle("Probation practitioner details - Transitional Accommodation (CAS3)")
    await page.getByLabel("Name").fill(String('AutomatedTestUser AutomatedTestUser'))
    await page.getByLabel("Phone number").fill(String(faker.phone.number()))
    await page.getByLabel("Email").fill(faker.internet.email().toString())
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Backup contact / senior probation officer details - Transitional Accommodation (CAS3)")
    await page.getByLabel("Name").fill(String('AutomatedTestUser AutomatedTestUser'))
    await page.getByLabel("Phone number").fill(String(faker.phone.number()))
    await page.getByLabel("Email").fill(faker.internet.email().toString())
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("What is the person's PDU? - Transitional Accommodation (CAS3)")
    await page.getByLabel("Provide the PDU").fill(String('Kent'))
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("What is the person's phone number? - Transitional Accommodation (CAS3)")
    await page.getByLabel("Please provide an up to date contact number for the person on probation.").fill(String('02020202003'))
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#contact-details-status')).toHaveText('Completed')
}

async function confirmEligibility(page: Page) {
    await page.getByRole('link', { name: 'Confirm eligibility' }).click()
    await expect(page).toHaveTitle("How is the person eligible for Transitional Accommodation (CAS3)? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'Moving on as homeless from an Approved Premises (CAS1)', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("What is the person's release date? - Transitional Accommodation (CAS3)")
    await page.getByLabel("Day").fill(getDate(addMonths(new Date(), 6)).toString());
    await page.getByLabel("Month").fill((getMonth(addMonths(new Date(), 6)) + 1).toString());
    await page.getByLabel("Year").fill(getYear(addMonths(new Date(), 6)).toString());
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("What date is accommodation required from? - Transitional Accommodation (CAS3)")
    await page.getByLabel("Day").fill(getDate(addDays(new Date(), 10)).toString());
    await page.getByLabel("Month").fill((getMonth(addDays(new Date(), 10)) + 1).toString());
    await page.getByLabel("Year").fill(getYear(addDays(new Date(), 10)).toString());
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#eligibility-status')).toHaveText('Completed')
}

async function confirmConsent(page: Page) {
    await page.getByRole('link', { name: 'Confirm consent' }).click()
    await expect(page).toHaveTitle("Has consent for Transitional Accommodation (CAS3) been given? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'Yes', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#consent-status')).toHaveText('Completed')
}

async function enterLicenceConditions(page: Page) {
    await page.getByRole('link', { name: 'Enter licence conditions' }).click()
    await expect(page).toHaveTitle("Additional licence conditions - Transitional Accommodation (CAS3)")
    await page.getByRole('checkbox', { name: 'Alcohol monitoring', exact: true }).check()
    await page.locator('#alcoholMonitoringDetail').fill('Test Alcohol details')
    await page.getByRole('checkbox', { name: 'Engagement with services', exact: true }).check()
    await page.locator('#engagementWithServicesDetail').fill('Test Engagement with services')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#licence-conditions-status')).toHaveText('Completed')
}

async function reviewPrisonInformation(page: Page) {
    await page.getByRole('link', { name: 'Review prison information' }).click()
    await expect(page).toHaveTitle("Adjudications - Transitional Accommodation (CAS3)")
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#prison-information-status')).toHaveText('Completed')
}

async function enterPlacementConsiderations(page: Page) {
    await page.getByRole('link', { name: 'Enter placement considerations' }).click()
    await expect(page).toHaveTitle("Accommodation sharing - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'Yes', exact: true }).check()
    await page.getByRole('textbox', { name: 'How will you manage the person\'s risk if they are placed in shared accommodation?' }).fill('Test Risk is manageable')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Cooperation - Transitional Accommodation (CAS3)")
    await page.locator('#support').fill('Test details of how you to support placement considering any risks to the support worker')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Anti-social behaviour - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Substance misuse - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("RoSH level - Transitional Accommodation (CAS3)")
    await page.locator('#riskToChildren').fill('Risk to children details')
    await page.locator('#riskToPublic').fill('Risk to public details')
    await page.locator('#riskToKnownAdult').fill('Risk to known adult details')
    await page.locator('#riskToStaff').fill('Risk to staff details')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Risk management plan - Transitional Accommodation (CAS3)")
    await page.getByRole('textbox', { name: 'Victim safety planning' }).fill('Victim safety planning details')
    await page.getByRole('textbox', { name: 'Interventions and treatment' }).fill('Interventions and treatment details')
    await page.getByRole('textbox', { name: 'Monitoring and control' }).fill('Monitoring and control details')
    await page.getByRole('textbox', { name: 'Supervision' }).fill('Supervision details')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#placement-considerations-status')).toHaveText('Completed')
}

async function enterApprovalsForSpecificRisks(page: Page) {
    await page.getByRole('link', { name: 'Enter approvals for specific risks' }).click()
    await expect(page).toHaveTitle("Approvals for specific risks - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No, approvals are not required for this referral', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#approvals-for-specific-risks-status')).toHaveText('Completed')
}

async function outlineBehaviourInCAS(page: Page) {
    await page.getByRole('link', { name: 'Outline behaviour in CAS' }).click()
    await expect(page).toHaveTitle("Behaviour in previous accommodation - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#behaviour-in-cas-status')).toHaveText('Completed')
}

async function confirmPlacementLocation(page: Page) {
    await page.getByRole('link', { name: 'Confirm placement location' }).click()
    await expect(page).toHaveTitle("Is placement required in an alternative PDU? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#placement-location-status')).toHaveText('Completed')
}

async function addDisabilityCulturalAndSpecificNeeds(page: Page) {
    await page.getByRole('link', { name: 'Add disability, cultural and specific needs' }).click()
    await expect(page).toHaveTitle("Does the person have any of the following needs? - Transitional Accommodation (CAS3)")
    await page.getByRole('checkbox', { name: 'None of the above', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Will the person require a property with specific attributes or adaptations? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Does the person have any religious or cultural needs? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#disability-cultural-and-specific-needs-status')).toHaveText('Completed')
}

async function addInformationOnSafeguardingAndSupport(page: Page) {
    await page.getByRole('link', { name: 'Add information on safeguarding and support' }).click()
    await expect(page).toHaveTitle("Safeguarding and vulnerability - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Support in the community - Transitional Accommodation (CAS3)")
    await page.getByRole('textbox', { name: 'Provide details' }).fill('Test support details')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Local connections - Transitional Accommodation (CAS3)")
    await page.getByRole('textbox', { name: 'Provide details' }).fill('Test details of local connections')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveTitle("Caring responsibilities - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#safeguarding-and-support-status')).toHaveText('Completed')
}

async function provideFoodAllergies(page: Page) {
    await page.getByRole('link', { name: 'Provide any food allergies' }).click()
    await expect(page).toHaveTitle("Food allergies - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#food-allergies-status')).toHaveText('Completed')
}

async function outlineMoveOnPlan(page: Page) {
    await page.getByRole('link', { name: 'Outline move on plan' }).click()
    await expect(page).toHaveTitle("How will you prepare the person for move on after placement? - Transitional Accommodation (CAS3)")
    await page.getByRole('textbox', { name: 'Provide details' }).fill('Test preparation for move on after placement')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#move-on-plan-status')).toHaveText('Completed')
}

async function enterAccommodationReferralDetails(page: Page) {
    await page.getByRole('link', { name: 'Enter accommodation referral details' }).click()
    await expect(page).toHaveTitle("Has the Duty to Refer (DTR) / National Offender Pathway (NOP) been submitted? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Has a referral to Commissioned Rehabilitative Services (CRS) been submitted? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'Yes', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Have other accommodation options been considered? - Transitional Accommodation (CAS3)")
    await page.getByRole('radio', { name: 'Yes', exact: true }).check()
    await page.getByRole('textbox', { name: 'Provide details' }).fill('Test accommodation options are considered')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#accommodation-referral-details-status')).toHaveText('Completed')
}

async function checkAnswers(page: Page) {
    await page.getByRole('link', { name: 'Check your answers' }).click()
    await expect(page).toHaveTitle("Check your answers - Transitional Accommodation (CAS3)")
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle("Make a referral for Transitional Accommodation (CAS3) - Transitional Accommodation (CAS3)")
    await expect(page.locator('#check-your-answers-status')).toHaveText('Completed')
}

async function submitReferral(page: Page) {
    await page.getByLabel(/I confirm the information provided is complete, accurate and up to date./).check()
    await page.getByRole('button', { name: /Submit referral/ }).click()
}
