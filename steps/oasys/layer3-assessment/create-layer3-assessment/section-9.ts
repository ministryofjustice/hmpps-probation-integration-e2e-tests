import { expect, type Page } from '@playwright/test'

export const completeRoSHSection9RoSHSummary = async (page: Page) => {
    await page.getByRole('link', { name: 'RoSH Full Analysis' }).click()
    await page.getByRole('link', { name: 'Section 9' }).click()
    await page.getByLabel('Are there any current concerns about escape and abscond').selectOption('FA51~YES')
    await page.locator('#textarea_FA51_t').fill('OPD Autotest')
    await page.getByLabel('Are there any previous concerns about escape and abscond').selectOption('FA53~YES')
    await page.locator('#textarea_FA53_t').fill('OPD Autotest')
    await page
        .getByLabel('Are there any current concerns about control and disruptive behaviour')
        .selectOption('FA55~YES')
    await page.locator('#textarea_FA55_t').fill('OPD Autotest')
    await page
        .getByLabel('Are there any previous concerns about control and disruptive behaviour')
        .selectOption('FA56~YES')
    await page.locator('#textarea_FA56_t').fill('OPD Autotest')
    await page.getByLabel('Are there any current concerns about breach of trust').selectOption('FA58~YES')
    await page.locator('#textarea_FA58_t').fill('OPD Autotest')
    await page.getByLabel('Are there any previous concerns about breach of trust').selectOption('FA60~NO')
    await page.locator('#textarea_FA60_t').fill('OPD Autotest')
    await page.locator('#B6737316531953403').click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Summary (Layer 3)')
}
