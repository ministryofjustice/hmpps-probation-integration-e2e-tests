import { expect, test } from '@playwright/test'
import { data } from '../../test-data/test-data.js'
import { randomiseCommunityManagerName } from '../../steps/delius/staff/community-manager.js'
import { login as mpcLogin } from '../../steps/manage-pom-cases/login.js'
import { execCommand, getPodName } from '../../steps/k8s/k8s-utils.js'

test('View Delius case data', async ({ page }) => {
    test.slow() // extend the timeout - the import job can take a few minutes

    // Given a prisoner's information has changed
    const { nomsNumber } = data.prisoners.allocatedPrisoner
    const newManagerName = await randomiseCommunityManagerName(page, nomsNumber)

    // When the probation import job runs
    const namespace = 'offender-management-test'
    const deploymentName = 'allocation-manager'
    const podName = await getPodName(namespace, deploymentName)
    await execCommand(namespace, podName, deploymentName, ['sh', '-c', 'rake community_api:import'])

    // Then I can see the updated data
    await mpcLogin(page)
    await page.getByRole('link', { name: 'All allocated cases' }).click()
    await page.getByLabel('Find a case').fill(nomsNumber)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator('td', { hasText: nomsNumber }).first().locator('a').click()
    await expect(page.locator('tr', { has: page.locator('#com-name') })).toContainText(newManagerName)
})
