import { type Page } from '@playwright/test'
import { clickAccommodation, clickEducationTrainingEmpl, clickRelationships } from '../create-assessment.js'
import { completeAccommodationSection } from '../accommodation-section.js'
import { completeETESection } from '../ete-section.js'
import { completeRelationshipsSection } from '../relationships-section.js'

export const addLayer3AssessmentNeeds = async (page: Page, crn: string) => {
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
}
