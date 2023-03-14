import { type Page, expect } from '@playwright/test'
import {waitForJS} from "../../common/common.js";

export const completeOffenceAnalysis = async (page: Page) => {
    await waitForJS(page)
    await page.fill(
        '#textarea_2_1',
        "OASys Question - '2.1 Brief offence(s) details (indicate what exactly happened, when, where and how)' - Answer Input - 'HRosh to Partners, medium to male peers & children'"
    )
    await page.locator("[value='Enter Victim Details']").click()
    await expect(page.locator('#R6262620100578238 > h2')).toHaveText('Victim’s Relationship to Perpetrator')
    await page.getByLabel('Approx. Age').selectOption({ label: '26-49' })
    await page.getByLabel('Gender').selectOption({ label: 'Male' })
    await page.getByLabel('Race/Ethnicity').selectOption({ label: 'White - Irish' })
    await page.getByLabel('Victim - perpetrator relationship').selectOption({ label: 'Spouse/Partner - live in' })
    await page.click('input[value="Save"]')
    await page.click('input[value="Close"]')
    await page.fill(
        '#textarea_2_4_2',
        "OASys Question - 'Victim - perpetrator relationship' - Answer Input - 'Spouse/Partner - Live in"
    )
    await page.fill(
        '#textarea_2_4_1',
        "OASys Question - 'Any other information of specific note, consider vulnerability' - Answer Input - 'Test Other Information"
    )
    await page.fill(
        '#textarea_2_5',
        "OASys Question - '2.5 Impact on the victim (Note any particular consequences)'  - Answer Input - 'Test Impact - Very detrimental impact and sleeplessness'"
    )
    await page.fill(
        '#textarea_2_8',
        "OASys Question - '2.8 Why did it happen - evidence of motivation and triggers'  - Answer Input - 'Test Motivation and Trigger - Alcohol & Drugs'"
    )
    await page.fill(
        '#textarea_2_12',
        "OASys Question - '2.12 Pattern of offending (consider details of previous convictions)'  - Answer Input - 'Test Pattern -  violence with some property offending'"
    )
    await page.fill(
        '#textarea_2_98',
        "OASys Question - 'Identify offence analysis issues contributing to risks of offending and harm. Please include any positive factors.'  - Answer Input - 'Test Contributions'"
    )
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('3 - Accommodation (Layer 3)')
}
