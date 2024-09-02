import { type Page } from '@playwright/test'
import { clickAccommodation, clickEducationTrainingEmpl, clickRelationships } from '../create-assessment'
import { complete3AccommodationSection, complete3AccommodationSectionYes } from '../accommodation-section'
import { complete4ETESection, complete4ETESectionProblems } from '../ete-section'
import { complete6RelationshipsSection } from '../relationships-section'
import { signAndlock } from '../sign-and-lock'

export const addLayer3AssessmentNeeds = async (page: Page, role?: string) => {
    // And I click on "Accommodation' under Section 2 to 4
    await clickAccommodation(page)
    // And I complete "Accommodation" Section
    await complete3AccommodationSection(page)
    // And I click on 'ETE'(4 - Education, Training and Employability) under Section 2 to 4
    await clickEducationTrainingEmpl(page)
    // And I complete "Education, Training and Employability" Section
    await complete4ETESection(page)
    // And I click on "Relationships" under Section 2 to 4
    await clickRelationships(page)
    // And I complete "Relationships" Section
    await complete6RelationshipsSection(page)
    // And I sign and lock
    await signAndlock(page, role)
}
export const addLayer3AssessmentNeedsReview = async (page: Page) => {
    // And I click on "Accommodation' under Section 2 to 4
    await clickAccommodation(page)
    // And I complete "Accommodation" Section
    await complete3AccommodationSectionYes(page)
    // And I proceed to 'ETE'(4 - Education, Training and Employability) under Section 2 to 4
    // And I complete "Education, Training and Employability" Section
    await complete4ETESectionProblems(page)
    // And I proceed to "Relationships" under Section 2 to 4
    // And I complete "Relationships" Section
    await complete6RelationshipsSection(page)
}
