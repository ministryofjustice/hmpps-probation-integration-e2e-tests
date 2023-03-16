import { type Page, expect } from '@playwright/test'

export const completeRoSHFullSec8RisksToIndvdl = async (page: Page) => {
    await expect(page.locator('#itm_FA31')).toHaveCount(1)
    await expect(page.locator('#itm_FA32')).toHaveCount(1)
    await page.evaluate(() => {
        document.querySelector('#itm_FA31').value = 'FA31~YES';
        document.querySelector('#itm_FA31').dispatchEvent(new Event('change'));
        document.querySelector('#itm_FA32').value = 'FA32~YES';
        document.querySelector('#itm_FA32').dispatchEvent(new Event('change'));
    })
    await page.fill(
        '#textarea_FA33',
        "OASys Question - 'Describe circumstances, relevant issues and needs regarding current concerns (refer to sections 1-12 for indicators, particularly Section 1' - Answer Input - 'Test concerns about self-harm and suicide'"
    )

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
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > p')).toHaveText(
        'Summarise the risks you have identified in R6-R9. Consider both current and future risks. Include risks while the offender is in custody as well as on release. R11 should also be completed in the Risk Management section.'
    )
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R10 Summary')
}
