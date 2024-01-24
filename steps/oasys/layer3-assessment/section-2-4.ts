import { type Page } from '@playwright/test'
import { doUntil } from '../../delius/utils/refresh'
import { Person } from '../../delius/utils/person'

export const clickSection2To4 = async (page: Page, person: Person): Promise<void> => {
    await doUntilLinkIsVisible(page, 'RoSH Screening')
    await page.locator('a', { hasText: 'RoSH Screening' }).click()
    await page.locator('a', { hasText: 'Section 2 to 4' }).click()
    await page
        .getByLabel(
            `Could ${person.firstName}'s behaviour and circumstances have a negative impact on a child's wellbeing?`
        )
        .selectOption('R2.3~YES')
    await page.getByLabel('Identifiable children').selectOption('R2.4.1~NO')
    await page.getByLabel('Children in general').selectOption('R2.4.2~YES')
    await page.getByLabel('Risk of suicide').selectOption('R3.1~NO')
    await page.getByLabel('Risk of self-harm').selectOption('R3.2~NO')
    await page.getByLabel('Coping in custody / hostel setting').selectOption('R3.3~NO')
    await page.getByLabel('Vulnerability').selectOption('R3.4~NO')
    await page.getByLabel('Escape / abscond').selectOption('R4.1~YES')
    await page.getByLabel('Control issues / disruptive behaviour').selectOption('R4.2~YES')
    await page.getByLabel('Concerns in respect of breach of trust').selectOption('R4.3~YES')
    await page.getByLabel('Risks to other prisoners').selectOption('R4.4~NO')
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
}

export const doUntilLinkIsVisible = async (page: Page, linkText: string, options?): Promise<void> => {
    await doUntil(
        async () => {
            await page.reload()
        },
        async () => {
            const link = await page.waitForSelector(`a:has-text("${linkText}")`)
            const isVisible = await link.isVisible()
            if (isVisible) {
                return Promise.resolve()
            } else {
                throw new Error('Link is not visible')
            }
        },
        options
    )
}
