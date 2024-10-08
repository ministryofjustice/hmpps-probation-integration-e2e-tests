import { type Page, expect } from '@playwright/test'

export const complete4ETESection = async (page: Page) => {
    await page
        .getByLabel('Is the person unemployed, or will be unemployed on release')
        .selectOption({ label: '0 - No' })
    await page.getByLabel('Employment history').selectOption({ label: '0-No problems' })
    await page.getByLabel('Work-related skills').selectOption({ label: '0-No problems' })
    await page.getByLabel('Attitude to employment').selectOption({ label: '0-No problems' })
    await page.getByLabel('School attendance (optional)').selectOption({ label: '0-No problems' })
    await page.getByLabel('Has problems with reading, writing or numeracy').selectOption({ label: '0-No problems' })
    await page.locator('#itm_4_7_1_NUMERACY').check()
    await page.getByLabel('Has learning difficulties (optional)').selectOption({ label: '0-No problems' })
    await page
        .getByLabel('Any educational or formal professional / vocational qualifications (optional)')
        .selectOption({ label: '2 - No qualifications' })
    await page.getByLabel('Attitude to education / training (optional)').selectOption({ label: '0-No problems' })
    await page.getByLabel('Enter Initial Skills Checker Score').selectOption({ label: 'Below 40' })
    await page.fill(
        '#textarea_4_94',
        "OASys Question - 'Identify education, training and employability issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test education, training and employability issues'"
    )
    await page
        .getByLabel(
            'Education / training / employability issues linked to risk of serious harm, risks to the individual & other risks'
        )
        .selectOption({ label: 'No' })
    await page
        .getByLabel('Education / training / employability issues linked to offending behaviour')
        .selectOption({ label: 'No' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('5 - Financial Management and Income (Layer 3)')
}

export const complete4ETESectionProblems = async (page: Page) => {
    await page
        .getByLabel('Is the person unemployed, or will be unemployed on release')
        .selectOption({ label: '0 - No' })
    await page.getByLabel('Employment history').selectOption({ label: '0-No problems' })
    await page.getByLabel('Work-related skills').selectOption({ label: '1-Some problems' })
    await page.getByLabel('Attitude to employment').selectOption({ label: '2-Significant problems' })
    await page.getByLabel('School attendance (optional)').selectOption({ label: 'Missing' })
    await page.getByLabel('Has problems with reading, writing or numeracy').selectOption({ label: '0-No problems' })
    await page.locator('#itm_4_7_1_NUMERACY').check()
    await page.getByLabel('Has learning difficulties (optional)').selectOption({ label: '1-Some problems' })
    await page
        .getByLabel('Any educational or formal professional / vocational qualifications (optional)')
        .selectOption({ label: '2 - No qualifications' })
    await page
        .getByLabel('Attitude to education / training (optional)')
        .selectOption({ label: '2-Significant problems' })
    await page.getByLabel('Enter Initial Skills Checker Score').selectOption({ label: 'Below 40' })
    await page.fill(
        '#textarea_4_94',
        "OASys Question - 'Identify education, training and employability issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test education, training and employability issues'"
    )
    await page
        .getByLabel(
            'Education / training / employability issues linked to risk of serious harm, risks to the individual & other risks'
        )
        .selectOption({ label: 'Yes' })
    await page
        .getByLabel('Education / training / employability issues linked to offending behaviour')
        .selectOption({ label: 'Yes' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('5 - Financial Management and Income (Layer 3)')
    await page.click('input[value="Next"]')
}
