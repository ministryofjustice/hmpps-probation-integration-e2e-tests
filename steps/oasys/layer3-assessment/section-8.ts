import { type Page, expect } from '@playwright/test'

export const completeRoSHSection8FullAnalysisYes = async (page: Page) => {
    await page.keyboard.down('End')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText('R8 Risks to the individual - full analysis')
    await page.fill(
        '#textarea_FA62',
        "OASys Question - 'R8.1 Suicide and / or Self-harm - Provide an analysis of any current or previous suicide and/or self-harm concerns, include any information from ACCT assessments (Assessments, Care in Custody and Teamwork)'"
    )
    await page.fill(
        '#textarea_FA63',
        "OASys Question - 'R8.2 Coping in custody / approved premises / hostel setting / secure hospital - Provide an analysis of the circumstances, relevant issues and need - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await page.fill(
        '#textarea_FA64',
        "OASys Question - 'R8.3 - Vulnerability - Provide an analysis of any vulnerabilities:- what are the relevant issues and needs. - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await page
        .getByLabel(
            "Do any of the above concerns (R8.1 - 8.3) increase the person's potential to cause harm to others or need to be addressed to support the effective delivery of the RMP"
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
