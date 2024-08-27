import { type Page } from '@playwright/test'
import { clickAccommodation, clickEducationTrainingEmpl, clickRelationships } from '../create-assessment'
import { completeAccommodationSection, completeAccommodationSectionYes } from '../accommodation-section'
import { completeETESection, completeETESectionProblems } from '../ete-section'
import { completeRelationshipsSection } from '../relationships-section'
import { signAndlock } from '../sign-and-lock'

export const addLayer3AssessmentNeeds = async (page: Page, role?: string) => {
    await page.locator('a', { hasText: 'Section 2 to 13' }).click()
    // And I click on "Accommodation' under Section 2 to 4
    await clickAccommodation(page)
    // And I complete "Accommodation" Section
    await completeAccommodationSection(page)
    // And I click on 'ETE'(4 - Education, Training and Employability) under Section 2 to 4
    await clickEducationTrainingEmpl(page)
    // And I complete "Education, Training and Employability" Section
    await completeETESection(page)
    // And I click on "Relationships" under Section 2 to 4
    await clickRelationships(page)
    // And I complete "Relationships" Section
    await completeRelationshipsSection(page)
    // And I sign and lock
    await signAndlock(page, role)
}
export const addLayer3AssessmentNeedsReview = async (page: Page) => {
    // And I click on "Accommodation' under Section 2 to 4
    await page.locator('a', { hasText: 'Section 2 to 13' }).click()
    await clickAccommodation(page)
    // And I complete "Accommodation" Section
    await completeAccommodationSectionYes(page)
    // And I proceed to 'ETE'(4 - Education, Training and Employability) under Section 2 to 4
    // And I complete "Education, Training and Employability" Section
    await completeETESectionProblems(page)
    // And I proceed to "Relationships" under Section 2 to 4
    // And I complete "Relationships" Section
    await completeRelationshipsSection(page)
}
