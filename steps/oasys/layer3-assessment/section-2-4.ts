import { expect, type Page } from '@playwright/test'
import { Person } from '../../delius/utils/person'

export const clickSection2To4 = async (page: Page, person: Person): Promise<void> => {
    await page
        .getByLabel(
            `Could ${person.firstName}'s behaviour and circumstances have a negative impact on a child's wellbeing?`
        )
        .selectOption('R2.3~YES')
    await page.getByLabel('Identifiable children').selectOption('R2.4.1~NO')
    await page.getByLabel('Children in general').selectOption('R2.4.2~YES')
    await page.getByLabel('Risk of suicide').selectOption('R3.1~NO')
    await page.getByLabel('Risk of self-harm').selectOption('R3.2~NO')
    await page.getByLabel('Coping in Custody / Approved Premises / Hostel').selectOption('R3.3~NO')
    await page.getByLabel('Vulnerability').selectOption('R3.4~NO')
    await page.getByLabel('Escape / abscond').selectOption('R4.1~YES')
    await page.getByLabel('Control Issues / Disruptive Behaviour and Breach of Trust').selectOption('R4.6~YES')
    await page.getByLabel('Risks to other prisoners').selectOption('R4.4~NO')
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
}

export const clickSection2To4RoshYes = async (page: Page, person: Person): Promise<void> => {
    await page
        .getByLabel(
            `Could ${person.firstName}'s behaviour and circumstances have a negative impact on a child's wellbeing?`
        )
        .selectOption('R2.3~YES')
    await page.getByLabel('Identifiable children').selectOption('R2.4.1~NO')
    await page.getByLabel('Children in general').selectOption('R2.4.2~YES')
    await page.getByLabel('Risk of suicide').selectOption('R3.1~YES')
    await page.getByLabel('Risk of self-harm').selectOption('R3.2~YES')
    await page.getByLabel('Coping in Custody / Approved Premises / Hostel').selectOption('R3.3~YES')
    await page.getByLabel('Vulnerability').selectOption('R3.4~YES')
    await page.getByLabel('Escape / abscond').selectOption('R4.1~YES')
    await page.getByLabel('Control Issues / Disruptive Behaviour and Breach of Trust').selectOption('R4.6~YES')
    await page.getByLabel('Risks to other prisoners').selectOption('R4.4~NO')
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
}

export const clickSection2To4NextButton = async (page: Page): Promise<void> => {
    await page.getByLabel('Risk of suicide').click()
    await page.getByLabel('Risk of suicide').selectOption({ label: 'Yes' })
    await page.getByLabel('Risk of self-harm').selectOption({ label: 'Yes' })
    await page.getByLabel('Coping in Custody / Approved Premises / Hostel').selectOption({ label: 'Yes' })
    await page.getByLabel('Vulnerability').selectOption({ label: 'Yes' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 h6')).toHaveText('R5 Other information - screening')
}
