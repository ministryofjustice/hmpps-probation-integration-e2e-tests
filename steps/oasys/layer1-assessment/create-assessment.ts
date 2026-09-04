import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Yesterday } from '../../delius/utils/date-time'
import { fillDateOasys } from '../../delius/utils/inputs'
import { complete2OffenceAnalysisSection } from './offence-analysis-section'

export const createLayer1AssessmentReview = async (page: Page) => {
    await page.locator('#P10_PURPOSE_ASSESSMENT_ELM').selectOption({ label: 'Review' })
    await page.locator('#P10_ASSESSMENT_TYPE_ELM').selectOption({ label: 'Basic (Layer 1)' })
    await page.click('#B3730320750239994')
    await expect(page.locator('#contextleft > h3')).toHaveText('Case ID - Offender Information (Layer 1)')
}

export const clickSection1 = async (page: Page) => {
    await page.getByRole('link', { name: 'Section 1' }).click()
    await page.getByRole('link', { name: 'Offending Information' }).click()
}

export const completeSection1 = async (
    page: Page,
    firstOffenceDate: Date = faker.date.recent({ days: 1, refDate: Yesterday.toJSDate() }),
    offenceCode?: string,
    offenceSubCode?: string
) => {
    if (offenceCode && offenceSubCode) {
        await page.locator('#P6_CT_OFFENCE_CODE_TEXT').fill(offenceCode)
        await page.locator('#P6_CT_OFFENCE_SUBCODE_TEXT').fill(offenceSubCode)
    }
    await page.getByLabel('Count').fill('1')
    await page.getByRole('link', { name: 'Predictors' }).click()
    await page.getByLabel('Date of first sanction').click()
    await fillDateOasys(page, '#itm_1_8_2', firstOffenceDate)
    await page.getByLabel('Total number of sanctions for all offences').fill('11')
    await page.getByLabel('How many of the total number of sanctions involved violent offences').fill('4')
    const _date = faker.date.recent({ days: 1, refDate: Yesterday.toJSDate() })
    await page.getByLabel('Date of current conviction').click()
    await fillDateOasys(page, '#itm_1_29', _date)

    // Check if 'Have they ever committed a sexual or sexually motivated offence?' is enabled
    const sexualOffenceDropdown = page.locator('tr #itm_1_30')
    const isSexualOffenceDropdownEnabled = await sexualOffenceDropdown.isEnabled()
    if (isSexualOffenceDropdownEnabled) {
        await sexualOffenceDropdown.selectOption('1.30~YES')
        await page.getByLabel('Does the current offence have a sexual motivation?').selectOption('1.41~YES')
    }

    const contactOffenceDropdown = page.getByLabel(
        'Does the current offence involve actual/attempted direct contact against a victim who was a stranger?'
    )
    await contactOffenceDropdown.waitFor({ state: 'visible' })
    await contactOffenceDropdown.selectOption('1.44~YES')

    await page.getByLabel('Date of most recent sanction involving a sexual/sexually motivated offence').click()
    await fillDateOasys(page, '#itm_1_33', _date)
    await page
        .getByLabel('Number of previous/current sanctions involving contact adult sexual/sexually motivated offences')
        .fill('1')
    await page
        .getByLabel(
            'Number of previous/current sanctions involving direct contact child sexual/sexually motivated offences'
        )
        .fill('0')
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
    await page.getByLabel('Date of commencement of community sentence').click()
    await fillDateOasys(page, '#itm_1_38', _date)
    await page.locator('#B6737316531953403').click()
}

export const completeSection1NoSexualOffence = async (
    page: Page,
    firstOffenceDate: Date = faker.date.recent({ days: 1, refDate: Yesterday.toJSDate() }),
    offenceCode?: string,
    offenceSubCode?: string
) => {
    if (offenceCode && offenceSubCode) {
        await page.locator('#P6_CT_OFFENCE_CODE_TEXT').fill(offenceCode)
        await page.locator('#P6_CT_OFFENCE_SUBCODE_TEXT').fill(offenceSubCode)
    }
    await page.getByLabel('Count').fill('1')
    await page.getByRole('link', { name: 'Predictors' }).click()
    await page.getByLabel('Date of first sanction').click()
    await fillDateOasys(page, '#itm_1_8_2', firstOffenceDate)
    await page.getByLabel('Total number of sanctions for all offences').fill('1')
    await page.getByLabel('How many of the total number of sanctions involved violent offences').fill('0')
    const _date = faker.date.recent({ days: 1, refDate: Yesterday.toJSDate() })
    await page.getByLabel('Date of current conviction').click()
    await fillDateOasys(page, '#itm_1_29', _date)

    // Check if 'Have they ever committed a sexual or sexually motivated offence?' is enabled
    const sexualOffenceDropdown = page.locator('tr #itm_1_30')
    const isSexualOffenceDropdownEnabled = await sexualOffenceDropdown.isEnabled()
    if (isSexualOffenceDropdownEnabled) {
        await sexualOffenceDropdown.selectOption('1.30~NO')
    }
    await saveAndNavigate(page)
}

export const completeSection2OffenceAnalysis = async (page: Page) => {
    await page.getByRole('link', { name: '2 - Offence Analysis' }).click()
    await complete2OffenceAnalysisSection(page)
    await saveAndNavigate(page)
}

export const completePredictorQuestions = async (page: Page) => {
    await page.getByLabel('Is the offender living in suitable accommodation').selectOption({ label: '0-No problems' })
    await page.getByLabel('Is the person unemployed, or will be unemployed on release').selectOption({ label: '0-No' })
    await page.getByLabel('Current relationship with partner').selectOption({ label: '2-Significant problems' })
    await page.getByLabel('Is there evidence of current or previous domestic abuse?').selectOption({ label: 'No' })
    await page.getByLabel('Current relationship status').selectOption({ label: 'In a relationship, living together' })
    await page.getByLabel('Regular activities encourage offending').selectOption({ label: '0-No problems' })
    await page.getByLabel('Drugs ever misused (in custody and community)').selectOption('No')
    await page.getByLabel("Is the person's current use of alcohol a problem").selectOption({ label: '0-No problems' })
    await page
        .getByLabel('Is there evidence of binge drinking or excessive use of alcohol in last 6 months')
        .selectOption({ label: '0-No problems' })
    await page.getByLabel('Is impulsivity a problem for the offender').selectOption({ label: '0-No problems' })
    await page.getByLabel('Is temper control a problem for the offender').selectOption({ label: '0-No problems' })
    await page.getByLabel('Does the offender have pro-criminal attitudes').selectOption({ label: '0-No problems' })
    await saveAndNavigate(page)
}

export const completeSelfAssessmentForm = async (page: Page) => {
    await page.getByLabel('Did the offender need help to complete the form').selectOption('No')
    const offenceDate = faker.date.recent({ days: 1, refDate: Yesterday.toJSDate() })
    await page.getByLabel('Date Self Assessment Questionnaire Completed').click()
    await fillDateOasys(page, '#itm_SAQB.date', offenceDate)
    await page.getByRole('button', { name: 'Mark unanswered as No' }).click()
    await page.keyboard.down('End')
    await page.getByLabel('Do you think you are likely to offend in future').selectOption('Definitely not')
    await page.getByLabel('Why do you think this').fill('OPD Autotest')
    await saveAndNavigate(page)
}

export const clickRoSHSummary = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Summary' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Summary (Layer 1)')
}

export const clickRiskManagementPlan = async (page: Page) => {
    await page.locator('a', { hasText: 'Risk Management Plan' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk Management Plan (Layer 1)')
}

const saveAndNavigate = async (page: Page) => {
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
}
