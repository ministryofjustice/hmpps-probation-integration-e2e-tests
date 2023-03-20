import { type Page } from '@playwright/test'
import {
    clickAddlInformationLink,
    clickAvailabilityLink,
    clickCaringCommitmentsLink,
    clickChooseEquipmentSizesLink,
    clickCulturalReligiousAdjustmentsLink,
    clickDisabilitiesAndMentalHealthLink,
    clickEmplEducationSkillsLink,
    clickGenderInformationLink,
    clickGPDetailsLink,
    clickHealthIssuesLink,
    clickIndividualDetailsLink,
    clickInstensiveWorkingLink,
    clickManagingRiskLink,
    clickPlacementPreferencesLink,
    clickRiskOfHarmCommunityLink,
    clickTrainingEmplOpprtunitiesLink,
    clickTravelInformationLink,
} from './task-list.js'
import { completeIndividualDetailsSection } from './individuals-details.js'
import { completeGenderInformationSection } from './gender-information.js'
import { completeCulturalReligiousAdjustmentsSection } from './cultural-and-religious-adjustments.js'
import { completePlacementPreferencesSection } from './placement-preferences.js'
import { completeRiskHarmCommunitySection } from './risk-of-harm-community.js'
import { completeManagingRiskSection } from './managing-risk.js'
import { completeHealthIssuesSection } from './health-issues.js'
import { completeDisabilitiesAndMentalHealthSection } from './disabilities-and-mental-health.js'
import { completeCaringCommitmentsSection } from './caring-commitments.js'
import { completeTravelInformationSection } from './travel-information.js'
import { completeGPDetails } from './gp-details.js'
import { completeEmplEducationSkillsSection } from './employment-education-skills.js'
import { completeTrainingEmplOpportunitiesSection } from './training-employment-opportunities.js'
import { completeIntensiveWorkingSection } from './intensive-working.js'
import { completeEquipmentSizesSection } from './choose-equipment-sizes.js'
import { completeAvailabilitySection } from './availability.js'
import {completeAddtlInformationSection} from "./additional-information.js";

export const completeAllUPWSections = async (page: Page) => {
    // And I click on "Individual's details" link
    await clickIndividualDetailsLink(page)
    // And I complete "Individual's details" Section
    await completeIndividualDetailsSection(page)
    // And I click on "Gender information" link
    await clickGenderInformationLink(page)
    // And I complete "Gender information" Section
    await completeGenderInformationSection(page)
    // And I click on "Cultural and Religious Adjustments" link
    await clickCulturalReligiousAdjustmentsLink(page)
    // And I complete "Cultural and Religious Adjustments" Section
    await completeCulturalReligiousAdjustmentsSection(page)
    // And I click on "Placement preferencesCOMPLETED" link
    await clickPlacementPreferencesLink(page)
    // And I complete "Placement preferencesCOMPLETED" Section
    await completePlacementPreferencesSection(page)
    // And I click on "Risk of harm in the community" link
    await clickRiskOfHarmCommunityLink(page)
    // And I complete "Risk of harm in the community" Section
    await completeRiskHarmCommunitySection(page)
    // And I click on "Managing risk" link
    await clickManagingRiskLink(page)
    // And I complete "Managing risk" Section
    await completeManagingRiskSection(page)
    // And I click on "Disabilities and Mental Health" link
    await clickDisabilitiesAndMentalHealthLink(page)
    // And I complete "Disabilities and Mental Health" Section
    await completeDisabilitiesAndMentalHealthSection(page)
    // And I click on "Health Issues" link
    await clickHealthIssuesLink(page)
    // And I complete "Health Issues" Section
    await completeHealthIssuesSection(page)
    // And I click on "GP details" link
    await clickGPDetailsLink(page)
    // And I complete "GP details" Section
    await completeGPDetails(page)
    // And I click on "Travel" link
    await clickTravelInformationLink(page)
    // And I complete "Travel information" Section
    await completeTravelInformationSection(page)
    // And I click on "Caring commitments" link
    await clickCaringCommitmentsLink(page)
    // And I complete "Caring commitments" Section
    await completeCaringCommitmentsSection(page)
    // And I click on "Employment, education and skills" link
    await clickEmplEducationSkillsLink(page)
    // And I complete "Employment, education and skills" Section
    await completeEmplEducationSkillsSection(page)
    // And I click on "Training & employment opportunities" link
    await clickTrainingEmplOpprtunitiesLink(page)
    // And I complete "Training & employment opportunities" Section
    await completeTrainingEmplOpportunitiesSection(page)
    // And I click on "Intensive working" link
    await clickInstensiveWorkingLink(page)
    // And I complete "Intensive working" Section
    await completeIntensiveWorkingSection(page)
    // And I click on "Availability" link
    await clickAvailabilityLink(page)
    // And I complete "Availability" Section
    await completeAvailabilitySection(page)
    // And I click on "Choose equipment sizes" link
    await clickChooseEquipmentSizesLink(page)
    // And I complete "Choose equipment sizes" Section
    await completeEquipmentSizesSection(page)
    // And I click on "Additional information" link
    await clickAddlInformationLink(page)
    // And I complete "Additional information" Section
    await completeAddtlInformationSection(page)
}
