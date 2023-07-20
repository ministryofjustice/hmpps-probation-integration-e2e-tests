import { type Page } from '@playwright/test'

export const enableContactFeatureFlag = async (page: Page) => {
    await page.goto(`${process.env.CONSIDER_A_RECALL_URL}/flags`)
    await page.getByRole('group', { name: 'Create NDelius contact' }).getByLabel('On').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await page.goto(process.env.CONSIDER_A_RECALL_URL)
}
