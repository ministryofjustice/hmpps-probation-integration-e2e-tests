import { type Page, expect } from '@playwright/test'
import {waitForJS} from "../../common/common.js";

export const completeRoSHFullSec8RisksToIndvdl = async (page: Page) => {
    // await waitForJS(page, 3000)

    //
    // await page.locator('#textarea_FA41').click();
    // await page.locator('#textarea_FA41').fill('test');

    page.on('console', msg => console.log(msg.text()))
    console.log(await page.content())
    console.log(page.getByRole('combobox', { name: 'Are there any current concerns about suicide' }))
    console.log(await page.getByRole('combobox', { name: 'Are there any current concerns about suicide' }).count())



    await page.getByLabel('Are there any current concerns about coping in custody').selectOption({ label: 'Yes' }),
    await page
        .getByLabel('Are there any current concerns about coping in hostel settings')
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA41',
        "OASys Question - 'R8.2 Coping in custody / hostel setting - Describe circumstances, relevant issues and needs' - Answer Input - 'Test Issues and Needs'"
    )
    await page
        .getByLabel(
            'Are there any current concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited)'
        )
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA45_t',
        "OASys Question - 'R8.3.1 Are there any current concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited) - Yes - Describe circumstances, relevant issues and needs' - Answer Input - 'Test Issues and Needs'"
    )

    await page.getByRole('combobox', { name: 'Are there any current concerns about suicide' }).selectOption('FA31~YES');
    await page.getByRole('combobox', { name: 'Are there any current concerns about self-harm' }).selectOption('FA32~YES');


    await page.fill(
        '#textarea_FA33',
        "OASys Question - 'Describe circumstances, relevant issues and needs regarding current concerns (refer to sections 1-12 for indicators, particularly Section 1' - Answer Input - 'Test concerns about self-harm and suicide'"
    )

    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > p')).toHaveText(
        'Summarise the risks you have identified in R6-R9. Consider both current and future risks. Include risks while the offender is in custody as well as on release. R11 should also be completed in the Risk Management section.'
    )
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R10 Summary')
}
