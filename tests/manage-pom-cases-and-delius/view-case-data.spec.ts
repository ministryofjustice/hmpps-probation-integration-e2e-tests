import { expect, test } from '@playwright/test'
import { data } from '../../test-data/test-data'
import { randomiseCommunityManagerName } from '../../steps/delius/staff/community-manager'
import { login as mpcLogin } from '../../steps/manage-pom-cases/login'
import { switchCaseload } from '../../steps/manage-pom-cases/caseload'
import { execCommand, getPodName } from '../../steps/k8s/k8s-utils'

test('View Delius case data', async ({ page }) => {
    test.slow() // extend the timeout - the import job can take a few minutes

    // Given a prisoner's information has changed
    const { nomsNumber } = data.prisoners.allocatedPrisoner
    const newManagerName = await randomiseCommunityManagerName(page, nomsNumber)

    // When the probation import job runs
    const namespace = 'offender-management-staging'
    const deploymentName = 'offender-management'
    const podName = await getPodName(namespace, deploymentName)
    await execCommand(namespace, podName, deploymentName, ['sh', '-c', 'rake community_api:import'])

    // Then I can see the updated data
    await mpcLogin(page)
    await switchCaseload(page, 'Moorland (HMP & YOI)')
    await page.getByRole('link', { name: 'All allocated cases' }).click()
    await page.getByLabel('Find a case').fill(nomsNumber)
    await page.locator('#search-button').click()
    await page.locator('td', { hasText: nomsNumber }).first().locator('a').click()
    await expect(page.locator('tr', { has: page.locator('#com-name') })).toContainText(newManagerName)
})
