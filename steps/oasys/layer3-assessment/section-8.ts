import { type Page, expect } from '@playwright/test'

export const completeRoSHSection8FullAnalysisYes = async (page: Page) => {
    await page.keyboard.down('End')
    await page.click('input[value="Next"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R8 Risks to the individual - full analysis')
    await page.getByLabel('Are there any current concerns about suicide').selectOption({ label: 'Yes' })
    await page.getByLabel('Are there any current concerns about self-harm').selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA33',
        "OASys Question - '8.1.1 Are there any current concerns about suicide & self-harm - Ans: Test circumstances, relevant issues and needs regarding current concerns'"
    )
    await page.fill('#itm_FA35', '1000')
    await page.getByLabel('Have there been any concerns about suicide in the past').selectOption({ label: 'Yes' })
    await page.getByLabel('Have there been any concerns about self-harm in the past').selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA38',
        "OASys Question - 'R8.1.3 & R8.1.4 Have there been any concerns about suicide & self-harm in the past - Ans: Test circumstances, relevant issues and needs regarding concerns in the past"
    )
    await page.getByLabel('Are there any current concerns about coping in custody').selectOption({ label: 'Yes' })
    await page
        .getByLabel('Are there any current concerns about coping in hostel settings')
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA41',
        "OASys Question - 'R8.2.1 Are there any current concerns about coping in custody or Hostel settings - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await page.getByLabel('Are there any previous concerns about coping in custody').selectOption({ label: 'Yes' })
    await page
        .getByLabel('Are there any previous concerns about coping in hostel settings')
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA44',
        "OASys Question - 'R8.2.2 Are there any previous about coping in custody or Hostel settings - Ans: Test circumstances, relevant issues and needs regarding previous concerns"
    )
    await page
        .getByLabel(
            'Are there any current concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited)'
        )
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA45_t',
        "OASys Question - 'R8.3.1 Are there any current concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited) - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await page
        .getByLabel(
            'Have there been any previous concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited)'
        )
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA47_t',
        "OASys Question - 'R8.3.2 Have there been any previous concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited) - Ans: Test circumstances, relevant issues and needs regarding previous concerns"
    )
    await page
        .getByLabel(
            'Do any of the above (R8.1 - 8.3) indicate a risk of serious harm to others. If YES complete the risk of serious harm analysis, R6'
        )
        .selectOption({ label: 'Yes' })
    await page.fill(
        '#textarea_FA49_t',
        "OASys Question - 'R8.4.1 Do any of the above (R8.1 - 8.3) indicate a risk of serious harm to others. If YES complete the risk of serious harm analysis, R6 - Ans: Test circumstances, relevant issues and needs regarding concerns"
    )
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Full Analysis (Layer 3)')
}
