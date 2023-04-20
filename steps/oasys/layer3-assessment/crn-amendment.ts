import { type Page, expect } from '@playwright/test'

export const clickOKForCRNAmendment = async (page: Page) => {
    const crnAmendmentHeader = 'CRN Amendment'
    const wipheader = 'Work in Progress Assessment'
    const header = await page.locator('#contextleft > h3, #R83709137890759118 > h2').first().textContent()

    // handle wip assessment for the same crn
    if (header.trim() == wipheader) {
        await page.click('#B74270608344555907')
        await page.click('#B2799414815519187')
        await page.click('#B83726850038339573')
        await expect(page.locator('#contextleft > h3')).toHaveText('CMS Search Results')
    } else if (header.trim() == crnAmendmentHeader) {
        await page.click('#B83726850038339573')
        await expect(page.locator('#contextleft > h3')).toHaveText('CMS Search Results')
    }
}
