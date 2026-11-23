import { type Page, expect } from '@playwright/test'

export const completeRiskManagementPlan = async (page: Page) => {
    await page.locator('#itm_RM1').selectOption('No')
    await page.locator('#itm_RM2').selectOption('No')
    await page.locator('#itm_RM3').selectOption('No')
    await page.locator('#itm_RM4').selectOption('No')

    await page.fill(
        '#textarea_RM28',
        "OASys Question - 'Further Considerations about Current Situation' - Answer Input - 'Currently in Custody at HMP Hewell - Mangement of Case under MAPPA Level 3'"
    )
    await page.fill(
        '#textarea_RM30',
        "OASys Question - 'Supervision' - Answer Input - 'Probation Officer, Education training and employment Officer, Prison Offender Supervisor'"
    )
    await page.fill(
        '#textarea_RM31',
        "OASys Question - 'Monitoring and Control'  - Answer Input - 'Test Monitoring and Control'"
    )
    await page.fill(
        '#textarea_RM32',
        "OASys Question - 'Interventions and Treatment'  - Answer Input - 'Test Interventions and Treatment'"
    )
    await page.fill(
        '#textarea_RM33',
        "OASys Question - 'Victim Safety Planning'  - Answer Input - 'Test Victim Safety Planning'"
    )
    await page.fill('#textarea_RM34', "OASys Question - 'Contingency Plans'  - Answer Input - 'Test Contingency Plans'")
    await page.fill(
        '#textarea_RM35',
        "OASys Question - 'Additional Comments'  - Answer Input - 'Test Additional Comments'"
    )
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('Sentence Plan Service (Layer 1)')
    await page.locator('input[value="Open Sentence Plan Service"]').click()

    // Open Sentence plan service and add a goal and then agree to plan
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('button', { name: 'Create goal' }).click()
    await page.locator('#area_of_need-6').check()
    await page.getByRole('button', { name: 'Continue' }).click()
    // Add a goal into text box
    await page.locator('#goal_title').fill('I will improve recognising')
    await page.getByRole('option').first().click()
    // Click No to relating to other areas
    await page.locator('#is_related_to_other_areas-2').check()
    // Click yes to can start working on the goal now
    await page.locator('#can_start_now').check()
    // Choose target date option
    await page.locator('#target_date_option').check()
    // Add steps
    await page.getByRole('button', { name: 'Add steps' }).click()
    // Step actor - open dropdown and select first option
    await page.locator('#step_actor_0').click()
    await page.getByRole('option').nth(1).click()
    // Description
    await page.locator('#step_description_0').fill('Manage emotions')
    // Step status - open dropdown and select first option
    await page.locator('#step_status_0').click()
    await page.getByRole('option').nth(1).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Agree plan' }).click()
    // Select "Yes" for plan agreement
    await page.locator('[data-ai-id="plan-overview-agree-plan-radio-yes"]').check()
    // Save
    await page.getByRole('button', { name: 'Save' }).click()
    // Return to OASys
    await page.getByRole('button', { name: 'Return to OASys' }).click()
    await expect(page.getByRole('button', { name: 'Sign & Lock', exact: true })).toBeVisible()
}
