import { expect, type Page } from '@playwright/test'
import { clickAccommodation, clickEducationTrainingEmpl, clickRelationships } from '../create-assessment'
import { complete3AccommodationSection, complete3AccommodationSectionYes } from '../accommodation-section'
import { complete4ETESection, complete4ETESectionProblems } from '../ete-section'
import { complete6RelationshipsSection } from '../relationships-section'
import { signAndlock } from '../sign-and-lock'
import { complete8DrugMisuseSection } from '../drug-misuse-section'
import { complete9AlcoholMisuseSection } from '../alcohol-misuse-section'

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

export const addLayer3AssessmentNeedsReview = async (page: Page, drugsAndAlcoholMisuse: boolean = false) => {
    // Click on "Accommodation" under Section 2 to 4
    await clickAccommodation(page)
    // Complete "Accommodation" Section
    await complete3AccommodationSectionYes(page)
    // Proceed to 'ETE' (4 - Education, Training and Employability) under Section 2 to 4
    // Complete "Education, Training and Employability" Section
    await complete4ETESectionProblems(page)
    // Proceed to "Relationships" under Section 2 to 4
    // Complete "Relationships" Section
    await complete6RelationshipsSection(page)

    // Check if drugs and alcohol misuse sections should be completed
    if (drugsAndAlcoholMisuse) {
        await page.click('input[value="Save"]')
        await page.click('input[value="Next"]')
        await expect(page.locator('#contextleft > h3')).toHaveText('8 - Drug Misuse (Layer 3)')
        await complete8DrugMisuseSection(page, true)
        await complete9AlcoholMisuseSection(page)
    }
}
