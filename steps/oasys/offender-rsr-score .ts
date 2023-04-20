import { type Page, expect } from '@playwright/test'
import { doUntil } from '../delius/utils/refresh.js'

export const inputRSRScoreAnswers = async (page: Page) => {
    await page.fill('#P5_CT_OFFENCE_CODE_TEXT', '029')
    await page.fill('#P5_CT_OFFENCE_SUBCODE_TEXT', '00')
    await page.waitForSelector('#P5_QU_1_8_2', { timeout: 10000 })
    await page.locator('#P5_QU_1_8_2').click()
    await page.fill('#P5_QU_1_8_2', '24102020')
    await page.fill('#P5_QU_1_32', '5')
    await page.fill('#P5_QU_1_40', '5')
    await page.fill('#P5_QU_1_29', '24102021')
    await page.locator('#P5_QU_1_30').selectOption({ label: 'No' })
    await page.fill('#P5_QU_1_38', '31122021')
    await page.locator('#P5_QU_1_39').selectOption({ label: 'No' })
    await doUntil(
        () => page.click('#P5_BT_CALC_RSR_BOTTOM_WARN'),
        () => expect(page.locator('#P5_RSR_TEXT_1')).toHaveText(/RSR score \(STATIC\) is .*/)
    )
}

export const verifyRSRScoreGeneration = async (page: Page): Promise<string> => {
    await expect(page.locator('#P5_RSR_TEXT_1')).toHaveText(/RSR score \(STATIC\) is .*/)
    const fullText = await page.locator('#P5_RSR_TEXT_1').textContent()
    const score = /\D*([\d.]+).*/.exec(fullText)[1]
    return score
}
