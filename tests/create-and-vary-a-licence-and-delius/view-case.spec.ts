import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as cvlLogin } from '../../steps/cvl-licences/login'
import { data } from '../../test-data/test-data'

dotenv.config() // read environment variables into process.env

test('View case in Create and Vary a Licence', async ({ page }) => {
    test.skip() // This test doesn't do anything yet, it just proves connectivity. We should write a proper test when we do the CVL integration.

    await cvlLogin(page)
    await page.getByRole('link', { name: 'Create and edit a licence before a release date' }).click()
    await expect(page.locator('.caseload-offender-name')).toContainText(
        data.prisoners.sentencedPrisonerWithReleaseDate.crn
    )
})
