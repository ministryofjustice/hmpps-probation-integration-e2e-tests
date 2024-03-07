import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { login as deliusLogin } from '../login'
import { findOffenderByNomisId } from '../offender/find-offender'
import { selectOption } from '../utils/inputs'
import { doUntil } from '../utils/refresh'

export async function randomiseCommunityManagerName(page: Page, nomsNumber: string) {
    const newValue = `ZZ${faker.string.alpha(6)}`
    await deliusLogin(page)
    await findOffenderByNomisId(page, nomsNumber)
    await doUntil(
        // wait for offendersummary call
        () => page.locator('#communitySupervisorToggleTitle').click(),
        () => expect(page.locator('#communityPractitioner\\:outputText')).not.toBeEmpty()
    )
    const provider = await page.locator('#provider\\:outputText').textContent()
    const surname = /[^,]+/.exec(await page.locator('#communityPractitioner\\:outputText').textContent())[0]
    await page.getByRole('link', { name: /Reference Data/ }).click()
    await page.getByRole('link', { name: 'Local Reference Records' }).click()
    await selectOption(page, 'select', provider)
    await page.getByRole('button', { name: 'Staff' }).click()
    await page.getByLabel('Search For:').fill(surname)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: 'update' }).click()
    await page.getByLabel('Forename2:').fill(newValue)
    await page.getByRole('button', { name: 'Save' }).click()
    return newValue
}
