import { expect, type Page } from '@playwright/test'

export const completeRoSHSection9RoSHSummary = async (page: Page) => {
    await page.getByRole('link', { name: 'RoSH Full Analysis' }).click()
    await page.getByRole('link', { name: 'Section 9' }).click()
    await page
        .locator('#textarea_FA65')
        .fill(
            'R9.1 Escape and abscond - Provide an analysis of the current / previous escape and abscond concerns - Test previous escape and abscond concerns'
        )
    await page
        .locator('#textarea_FA66')
        .fill(
            'R9.2 Control Issues / Disruptive Behaviour and Breach of Trust - Provide an analysis of the concerns, the circumstances, relevant issues and needs. Consider aggression, control issues / disruptive behaviour / breach of trust - Test aggression, control issues / disruptive behaviour / breach of trust concerns'
        )
    await page.locator('#B6737316531953403').click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Summary (Layer 3)')
}
