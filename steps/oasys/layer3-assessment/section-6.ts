import { expect, Page } from '@playwright/test'

export const completeRoSHSection6FullAnalysis = async (page: Page) => {
    await page.locator('[value="Insert offence details from Q2.1"]').click()
    await page.locator('[value="Insert evidence from Q2.8"]').click()
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    // await page.click('input[value="Previous"]')
    await expect(page.locator('#R2846717162014845  h6')).toHaveText('R6.2 Previous behaviour')

    await page.getByLabel('What exactly did s/he do').fill('Engaged in physical assault against a fellow inmate')
    await page
        .getByLabel('Where and when did s/he do it')
        .fill('The incident occurred in the prison yard during morning exercise hours.')
    await page
        .getByLabel('How did s/he do it (was there any pre planning, use of weapon, tool etc)')
        .fill('Initiated the assault without prior warning, using a makeshift weapon.')
    await page
        .getByLabel(
            'Who were the victims (were there concerns about targeting, type, age, race or vulnerability of victim)'
        )
        .fill('The victim was a vulnerable inmate with a history of mental health issues.')
    await page
        .getByLabel('Was anyone else present / involved')
        .fill('Several other inmates witnessed and intervened during the assault.')
    await page
        .getByLabel('Why did s/he do it (motivation and triggers)')
        .fill('Motivated by a perceived threat to his reputation within the inmate community.')
    await page
        .getByLabel('Sources of information')
        .fill('Information gathered from incident reports and witness statements.')

    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    // await expect(page.locator('#R2846717162014845 > h6')).toHaveText(
    //     'R6 Risk of serious harm to others - full analysis'
    // )
}
