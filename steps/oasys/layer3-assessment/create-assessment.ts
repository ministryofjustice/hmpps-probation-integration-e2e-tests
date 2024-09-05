import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Yesterday } from '../../delius/utils/date-time'
import { fillDateOasys } from '../../delius/utils/inputs'
import { doUntil } from '../../delius/utils/refresh'
import { complete3AccommodationSection } from './accommodation-section'
import { complete4ETESection } from './ete-section'
import { complete6RelationshipsSection } from './relationships-section'
import { complete5FinanceSection } from './finance-section'
import { complete7LifestyleSection } from './lifestyle-section'
import { complete9AlcoholMisuseSection } from './alcohol-misuse-section'
import { complete10EmotionalWellbeingSection } from './emotional-well-being-section'
import { complete11ThinkingAndBehaviourSection } from './thinking-behaviour-section'
import { complete12AttitudesSection } from './attitudes-section'
import { complete8DrugMisuseSection } from './drug-misuse-section'
import { complete2OffenceAnalysisSection } from './offence-analysis-section'

export const createLayer3Assessment = async (page: Page) => {
    await page.locator('#P10_PURPOSE_ASSESSMENT_ELM').selectOption({ label: 'Start custody' })
    await expect(page.locator('#P10_ASSESSMENT_TYPE_ELM')).toContainText('Full (Layer 3)')
    await page.click('#B3730320750239994')
    await expect(page.locator('#contextleft > h3')).toHaveText('Case ID - Offender Information (Layer 3)')
}

export const createLayer3AssessmentReview = async (page: Page) => {
    await page.locator('#P10_PURPOSE_ASSESSMENT_ELM').selectOption({ label: 'Review' })
    await expect(page.locator('#P10_ASSESSMENT_TYPE_ELM')).toContainText('Full (Layer 3)')
    await page.click('#B3730320750239994')
    await expect(page.locator('#contextleft > h3')).toHaveText('Case ID - Offender Information (Layer 3)')
}

export const clickRoSHScreeningSection1 = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Screening' }).click()
    await page.locator('a[href *= "ROSHA1"]', { hasText: 'Section 1' }).click()
    await page.getByLabel('Is the individual currently subject to a Civil or Ancillary Order?').selectOption('R1.4~NO')
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Screening (Layer 3)')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText(
        'R1 Information from other sections of OASys and risk of serious harm to others - screening'
    )
}

export const clickSection1 = async (
    page: Page,
    firstOffenceDate: Date = faker.date.recent({ days: 1, refDate: Yesterday })
) => {
    await page.getByRole('link', { name: 'Section 1' }).click()
    await page.getByRole('link', { name: 'Offending Information' }).click()
    await page.getByLabel('Count').fill('1')
    await page.getByRole('link', { name: 'Predictors' }).click()
    await page.getByLabel('Date of first sanction').click()
    await fillDateOasys(page, '#itm_1_8_2', firstOffenceDate)
    await page.getByLabel('Total number of sanctions for all offences').fill('11')
    await page.getByLabel('How many of the total number of sanctions involved violent offences?').fill('4')
    const _date = faker.date.recent({ days: 1, refDate: Yesterday })
    await page.getByLabel('Date of current conviction').click()
    await fillDateOasys(page, '#itm_1_29', _date)

    // Check if 'Have they ever committed a sexual or sexually motivated offence?' is enabled
    const sexualOffenceDropdown = page.locator('tr #itm_1_30')
    const isSexualOffenceDropdownEnabled = await sexualOffenceDropdown.isEnabled()

    if (isSexualOffenceDropdownEnabled) {
        await sexualOffenceDropdown.selectOption('1.30~YES')
        await page.getByLabel('Does the current offence have a sexual motivation?').selectOption('1.41~YES')
    } else {
        const contactOffenceDropdown = page.getByLabel(
            'Does the current offence involve actual/attempted direct contact against a victim who was a stranger?'
        )
        await contactOffenceDropdown.waitFor({ state: 'visible' })
        await contactOffenceDropdown.selectOption('1.44~YES')
    }

    await page.getByLabel('Date of most recent sanction involving a sexual/sexually motivated offence').click()
    await fillDateOasys(page, '#itm_1_33', _date)
    await page
        .getByLabel('Number of previous/current sanctions involving contact adult sexual/sexually motivated offences')
        .fill('1')
    await page
        .getByLabel(
            'Number of previous/current sanctions involving indecent child image or indirect child contact sexual/sexually motivated offences'
        )
        .fill('0')
    await page
        .getByLabel(
            'Number of previous/current sanctions involving other non-contact sexual/sexually motivated offences'
        )
        .fill('0')
    await page
        .getByLabel('Date of commencement of community sentence or earliest possible release from custody')
        .click()
    await fillDateOasys(page, '#itm_1_38', _date)
    await page.locator('#B6737316531953403').click()
}

export const clickSection2to13 = async (page: Page, needs: 'Yes' | 'No' = 'No') => {
    await page.getByRole('link', { name: 'Section 2 to 13' }).click()
    await page.getByRole('link', { name: '2 - Offence Analysis' }).click()
    await complete2OffenceAnalysisSection(page)
    if (needs === 'Yes') {
        await saveAndNavigate(page)
        await complete3AccommodationSection(page)
        await complete4ETESection(page)
        await complete5FinanceSection(page)
        await complete6RelationshipsSection(page)
        await complete7LifestyleSection(page)
        await complete8DrugMisuseSection(page)
        await complete9AlcoholMisuseSection(page)
        await complete10EmotionalWellbeingSection(page)
        await complete11ThinkingAndBehaviourSection(page)
        await complete12AttitudesSection(page)
    } else {
        await page.getByRole('link', { name: '5 - Finance' }).click()
        await complete5FinanceSection(page)
        await saveAndNavigate(page)
        await complete7LifestyleSection(page)
        await complete8DrugMisuseSection(page)
        await complete9AlcoholMisuseSection(page)
        await complete10EmotionalWellbeingSection(page)
        await complete11ThinkingAndBehaviourSection(page)
        await complete12AttitudesSection(page)
    }
}

export const selfAssessmentForm = async (page: Page) => {
    await page.locator('a', { hasText: 'Self Assessment Form' }).click()
    await page
        .getByLabel('Please provide a clear rationale for not fully completing the Self Assessment Questionnaire')
        .fill('OPD Autotest')
    await page.locator('#B6737316531953403').click()
}
export const clickRoSHSummary = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Summary' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Summary (Layer 3)')
}

export const clickRiskManagementPlan = async (page: Page) => {
    await page.locator('a', { hasText: 'Risk Management Plan' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk Management Plan (Layer 3)')
}

export const clickOffenceAnalysis = async (page: Page) => {
    await expandSectionIfNeeded(page, 'Section 2 to 13', '2 - Offence Analysis')
    await page.locator('a', { hasText: '2 - Offence Analysis' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('2 - Analysis of Offences (Layer 3)')
}

export const clickRoshFullRisksToIndividual = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Full Analysis' }).click()
    await page.locator('[href*="ROSHFA6"]', { hasText: 'Section 8' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Full Analysis (Layer 3)')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R8 Risks to the individual - full analysis')
}

export const clickAccommodation = async (page: Page) => {
    await page.locator('#section2to13').click()
    await page.locator("[href*='LAYER3_1_MENU,SEC3']").isVisible()
    await doUntil(
        () => page.locator("[href*='LAYER3_1_MENU,SEC3']", { hasText: '3 - Accommodation' }).click(),
        () => expect(page.locator('#contextleft > h3')).toHaveText('3 - Accommodation (Layer 3)'),
        { timeout: 60_000, intervals: [500, 1000, 5000] }
    )
}

export const clickEducationTrainingEmpl = async (page: Page) => {
    await expandSectionIfNeeded(page, 'Section 2 to 13', '4 - ETE')
    await doUntil(
        () => page.locator('a', { hasText: '4 - ETE' }).click(),
        () =>
            expect(page.locator('#contextleft > h3')).toHaveText('4 - Education, Training and Employability (Layer 3)'),
        { timeout: 60_000, intervals: [500, 1000, 5000] }
    )
}

export const clickRelationships = async (page: Page) => {
    await expandSectionIfNeeded(page, 'Section 2 to 13', '6 - Relationships')
    await doUntil(
        () => page.locator('a', { hasText: '6 - Relationships' }).click(),
        () => expect(page.locator('#contextleft > h3')).toHaveText('6 - Relationships (Layer 3)'),
        { timeout: 60_000, intervals: [500, 1000, 5000] }
    )
}

const saveAndNavigate = async (page: Page) => {
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
}
const expandSectionIfNeeded = async (page: Page, sectionText: string, linkText: string) => {
    const sectionLocator = page.locator('a', { hasText: sectionText })
    const linkLocator = page.locator('a', { hasText: linkText })

    // Check if the link is visible
    if (!(await linkLocator.isVisible())) {
        // Expand the section
        await sectionLocator.click()
        // Wait for the section to expand
        await page.waitForTimeout(1000)
    }

    // Verify that the link is visible after expanding
    await expect(linkLocator).toBeVisible()
}
