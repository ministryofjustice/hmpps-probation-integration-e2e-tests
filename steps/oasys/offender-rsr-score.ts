import { type Page, expect } from '@playwright/test'
import { doUntil } from '../delius/utils/refresh'

export const inputRSRScoreAnswers = async (page: Page) => {
    await page.fill('#P5_CT_OFFENCE_CODE_TEXT', '029')
    await page.fill('#P5_CT_OFFENCE_SUBCODE_TEXT', '00')
    await page.waitForSelector('#P5_QU_1_8_2', { timeout: 10000 })
    await page.locator('#P5_QU_1_8_2').first().click()
    await page.locator('#P5_QU_1_8_2').first().fill('24102020')
    await page.fill('#P5_QU_1_32', '5')
    await page.fill('#P5_QU_1_40', '5')
    await page.locator('#P5_QU_1_29').first().click()
    await page.locator('#P5_QU_1_29').first().fill('24102021')
    await page.locator('#P5_QU_1_30').selectOption({ label: 'No' })
    await page.locator('#P5_QU_1_38').first().click()
    await page.locator('#P5_QU_1_38').first().fill('31122021')
    await page.locator('#P5_QU_1_39').selectOption({ label: 'No' })
    await page.locator('span > #P5_BT_CALC_RSR_BOTTOM_WARN').click()
    await doUntil(
        () => page.click('span > #P5_BT_CALC_RSR_BOTTOM_WARN'),
        () => expect(page.locator('#P5_RSR_L_LABEL')).toHaveText('Combined Serious Reoffending Predictor')
    )
}

export const verifyRSRScoreGeneration = async (page: Page): Promise<string> => {
    const rsrSvg = page.locator('#RSR')
    await expect(rsrSvg).toBeVisible()

    // Extract from the SVG <title> (stable, contains the full phrase + number)
    const titleText = (await rsrSvg.locator('title').textContent())?.trim() ?? ''
    const titleMatch = titleText.match(/([\d.]+)%/)
    if (titleMatch?.[1]) return titleMatch[1] // e.g. "2.91"

    // Fallback 1: extract from the SVG <text> node that contains the numeric value
    const numericText =
        (
            await rsrSvg
                .locator('text', { hasText: /\d+(\.\d+)?/ })
                .last()
                .textContent()
        )?.trim() ?? ''
    const numericMatch = numericText.match(/([\d.]+)/)
    if (numericMatch?.[1]) return numericMatch[1]

    // Fallback 2: hidden textarea (still has text in it, but display:none)
    const hidden = (await page.locator('#P5_RSR_TEXT_1').textContent())?.trim() ?? ''
    const hiddenMatch = hidden.match(/([\d.]+)%/)
    if (hiddenMatch?.[1]) return hiddenMatch[1]

    throw new Error(`Unable to extract RSR score. SVG title="${titleText}"`)
}
