import { type Page, expect } from '@playwright/test'
import { doUntil } from '../../delius/utils/refresh'

export const clickSection2To4NextButton = async (page: Page): Promise<void> => {
    await doUntilLinkIsVisible(page, 'RoSH Screening')

    await page.locator('a', { hasText: 'Section 2 to 4' }).click()
    await page.getByLabel('Risk of suicide').click()
    await page.getByLabel('Risk of suicide').selectOption({ label: 'Yes' })
    await page.getByLabel('Risk of self-harm').selectOption({ label: 'Yes' })
    await page.getByLabel('Coping in custody / hostel setting').selectOption({ label: 'Yes' })
    await page.getByLabel('Vulnerability').selectOption({ label: 'Yes' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 h6')).toHaveText('R5 Other information - screening')
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
