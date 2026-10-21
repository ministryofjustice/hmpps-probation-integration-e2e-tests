import { expect, type Locator, type Page } from '@playwright/test'
import { findEventByCRN } from './find-events'
import { fillDate } from '../utils/inputs'
import { waitForAjax } from '../utils/refresh'

export interface CreateNsi {
    type: string
    // The first available option is selected for any of these that aren't provided
    subType?: string
    status?: string
    referralDate?: Date
}

// Delius populates some drop-downs based on earlier selections, so wait for those requests before choosing an option
const chooseOption = async (page: Page, select: Locator, label?: string) => {
    await waitForAjax(page)
    if (label) {
        await select.selectOption({ label })
    } else {
        const options = await select
            .locator('option')
            .evaluateAll(opts =>
                opts.filter(opt => (opt as HTMLOptionElement).value).map(opt => (opt as HTMLOptionElement).value)
            )
        if (options.length > 0) await select.selectOption(options[0])
    }
    await waitForAjax(page)
}

export async function createNsiForEvent(
    page: Page,
    crn: string,
    eventNumber: number,
    { type, subType, status, referralDate = new Date() }: CreateNsi
) {
    await findEventByCRN(page, crn, eventNumber)
    await page.getByRole('link', { name: 'NSIs' }).click()
    await expect(page).toHaveTitle(/Non Statutory Intervention List/)
    await page.getByRole('button', { name: 'Add Non Statutory Intervention' }).click()

    await chooseOption(page, page.getByLabel('Non Statutory Intervention:'), type)
    await chooseOption(page, page.getByLabel('Non Statutory Intervention Sub type:'), subType)
    await fillDate(page, '#ReferralDate\\:datePicker', referralDate)
    await page.keyboard.press('Tab')
    await chooseOption(page, page.getByLabel('Status:', { exact: true }), status)
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page).toHaveTitle(/Non Statutory Intervention List/)
}

// Opens the NSI's update screen, which is where documents can be created from templates
export async function openNsiForUpdate(page: Page) {
    await page.locator('#nsiTable > tbody').getByRole('link', { name: 'view', exact: true }).first().click()
    await expect(page).toHaveTitle(/Non Statutory Intervention Details/)
    try {
        // Delius can show a dialog when the NSI is opened
        await page.getByRole('button', { name: 'Close' }).click({ timeout: 5000 })
    } catch {
        // Ignore if the dialog isn't shown
    }
    await page.getByRole('link', { name: 'update' }).first().click()
}
