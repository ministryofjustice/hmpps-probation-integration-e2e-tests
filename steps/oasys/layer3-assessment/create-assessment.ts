import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Yesterday } from '../../delius/utils/date-time'
import { fillDateOasys } from '../../delius/utils/inputs'
import { doUntil } from '../../delius/utils/refresh'

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

export const clickSection2to13 = async (page: Page) => {
    await page.getByRole('link', { name: 'Section 2 to 13' }).click()
    await page.getByRole('link', { name: '2 - Offence Analysis' }).click()
    await page
        .getByRole('row', { name: 'Sexual motivation' })
        .getByLabel('Sexual motivation')
        .selectOption('2.9_V2_SEXUAL~YES')
    await page
        .getByRole('row', { name: 'Financial motivation' })
        .getByLabel('Financial motivation')
        .selectOption('2.9_V2_FINANCIAL~NO')
    await page
        .getByRole('row', { name: 'Addiction / perceived needs' })
        .getByLabel('Addiction / perceived needs')
        .selectOption('2.9_V2_ADDICTION~NO')
    await page
        .getByRole('row', { name: 'Emotional state of offender' })
        .getByLabel('Emotional state of offender')
        .selectOption('2.9_V2_EMOTIONAL~YES')
    await page
        .getByRole('row', { name: 'Racial motivation or hatred of other identifiable group' })
        .getByLabel('Racial motivation or hatred of other identifiable group')
        .selectOption('2.9_V2_RACIAL~NO')
    await page
        .getByRole('row', { name: 'Thrill seeking' })
        .getByLabel('Thrill seeking')
        .selectOption('2.9_V2_THRILL~NO')
    await page.getByRole('row', { name: 'Other', exact: true }).getByLabel('Other').selectOption('2.9_V2_OTHER~NO')
    await page
        .getByLabel(
            'Analysis of offence issues linked to risk of serious harm, risks to the individual and other risks'
        )
        .selectOption('2.99~YES')
    await page
        .getByLabel(
            'Identify offence analysis issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .click()
    await page
        .getByLabel(
            'Identify offence analysis issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page.getByRole('link', { name: '5 - Finance' }).click()
    await page.getByLabel('Severe impediment to budgeting (optional)').selectOption('5.6~1')
    await page
        .getByLabel(
            'Identify financial management issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Financial issues linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('5.98~NO')
    await page.getByLabel('Financial issues linked to offending behaviour').selectOption('5.99~NO')
    await page.getByRole('link', { name: '7 - Lifestyle & Associates' }).click()
    await page
        .getByLabel(
            'Community integration (Attachments to individual(s) or community groups.  Participation in organised activities not linked to offending, including prison, eg sports clubs, faith communities, etc) (Absence of any links = 2)'
        )
        .selectOption('7.1~1')
    await page.getByLabel('Recklessness and risk-taking behaviour').selectOption('7.5~2')
    await page
        .getByLabel(
            'Identify lifestyle issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Lifestyle and associates linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('7.98~YES')
    await page.getByLabel('Lifestyle and associates linked to offending behaviour').selectOption('7.99~YES')
    await page.locator('#B6737316531953403').click()
    await page.getByLabel('Drugs ever misused (in custody or community)').selectOption('8.1~NO')
    await page.locator('#B6737316531953403').click()
    await page.getByRole('link', { name: '9 - Alcohol Misuse' }).click()
    await page.getByLabel('Motivation to tackle alcohol misuse (if applicable)').selectOption('9.5~1')
    await page
        .getByLabel(
            'Identify alcohol misuse issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Alcohol misuse issues linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('9.98~NO')
    await page.getByLabel('Alcohol misuse issues linked to offending behaviour').selectOption('9.99~YES')
    await page.locator('#B6737316531953403').click()
    await page.getByLabel('Difficulties coping').selectOption('10.1~1')
    await page.getByLabel('Current psychological problems / depression').selectOption('10.2~0')
    await page.getByLabel('Social isolation').selectOption('10.3~0')
    await page.getByLabel("Offender's attitude to themselves").selectOption('10.4~0')
    await page.getByLabel('Self-harm, attempted suicide, suicidal thoughts or feelings').selectOption('10.5~NO')
    await page.getByLabel('Current psychiatric problems').selectOption('10.6~0')
    await page
        .getByLabel('Evidence of childhood behavioural problems', { exact: true })
        .selectOption('10.7_V2_CHILDHOOD~NO')
    await page
        .getByLabel('History of severe head injuries, fits, periods of unconsciousness', { exact: true })
        .selectOption('10.7_V2_HISTHEADINJ~NO')
    await page.getByLabel('History of psychiatric treatment', { exact: true }).selectOption('10.7_V2_HISTPSYCH~NO')
    await page
        .getByRole('row', { name: 'Ever been on medication for mental health problems in the past' })
        .locator('div')
        .click()
    await page
        .getByLabel('Ever been on medication for mental health problems in the past', { exact: true })
        .selectOption('10.7_V2_MEDICATION~NO')
    await page
        .getByLabel('Previously failed to co-operate with psychiatric treatment', { exact: true })
        .selectOption('10.7_V2_FAILEDTOCOOP~NO')
    await page
        .getByLabel('Ever been a patient in a Special Hospital or Regional Secure Unit', { exact: true })
        .selectOption('10.7_V2_PATIENT~NO')
    await page
        .getByRole('row', { name: 'Current psychiatric treatment or treatment pending' })
        .getByLabel('Current psychiatric treatment or treatment pending')
        .selectOption('10.7_V2_PSYCHTREAT~NO')
    await page.getByLabel('Is a Specialist Report required?').selectOption('10.8~NO')
    await page
        .getByLabel(
            'Identify any issues of emotional well-being contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel(
            'Issues of emotional wellbeing linked to risk of serious harm, risks to the individual and other risks'
        )
        .selectOption('10.98~NO')
    await page.getByLabel('Issues of emotional wellbeing linked to offending behaviour').selectOption('10.99~NO')
    await page.getByRole('link', { name: '11 - Thinking & Behaviour' }).click()
    await page.getByLabel('Level of interpersonal skills').selectOption('11.1~1')
    await page.getByLabel('Impulsivity').selectOption('11.2~2')
    await page.getByLabel('Aggressive / controlling behaviour').selectOption('11.3~2')
    await page.getByLabel('Temper control').selectOption('11.4~1')
    await page.getByLabel('Ability to recognise problems').selectOption('11.5~2')
    await page.getByLabel('Problem solving skills').selectOption('11.6~2')
    await page.getByLabel('Awareness of consequences').selectOption('11.7~2')
    await page.getByLabel("Understands other people's views").selectOption('11.9~1')
    await page.getByLabel('Sexual Pre-Occupation').selectOption('11.11~1')
    await page.getByLabel('Offence Related Sexual Interests').selectOption('11.12~1')
    await page
        .getByLabel(
            'Identify thinking / behavioural issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .click()
    await page
        .getByLabel(
            'Identify thinking / behavioural issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Thinking and behaviour linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('11.98~YES')
    await page.getByLabel('Thinking and behaviour linked to offending behaviour').selectOption('11.99~YES')
    await page.locator('#B6737316531953403').click()
    await page.getByLabel('Pro-criminal attitudes').selectOption('12.1~0')
    await page.getByLabel('Attitude towards staff (optional)').selectOption('12.3~0')
    await page.getByLabel('Attitude towards supervision / licence').selectOption('12.4~0')
    await page.getByLabel('Attitude towards community / society').selectOption('12.5~0')
    await page
        .getByLabel('Does the offender understand their motivation for offending (optional)')
        .selectOption('12.6~0')
    await page.getByLabel('Motivation to address offending behaviour').selectOption('12.8~0')
    await page.getByLabel('Hostile Orientation').selectOption('12.9~0')
    await page
        .getByLabel(
            'Identify issues about attitudes contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Attitudes linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('12.98~NO')
    await page.getByLabel('Attitudes linked to offending behaviour').selectOption('12.99~NO')
    await page.locator('#B6737316531953403').click()
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

const expandSectionIfNeeded = async (page: Page, sectionText: string, linkText: string) => {
    const sectionLocator = page.locator('a', { hasText: sectionText })
    const linkLocator = page.locator('a', { hasText: linkText })

    // await doUntil(
    //     async () => {
    //         if (!(await linkLocator.isVisible())) {
    //             await sectionLocator.click()
    //         }
    //     },
    //     async () => {
    //         await expect(linkLocator).toBeVisible()
    //     },
    //     { timeout: 60_000, intervals: [500, 1000, 5000] }
    // )

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
