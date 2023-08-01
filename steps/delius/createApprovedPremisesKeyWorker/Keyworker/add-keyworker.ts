import { expect, type Page } from '@playwright/test'
import { type Person } from '../../utils/person'

export const addKeyWorker = async (page: Page, person: Person) => {
    await expect(page.locator('#AddKeyWorkerForm\\:ApprovedPremises')).toHaveText('Bedford AP - Bedford')
    await page.getByLabel('Provider:').selectOption({ label: 'NPS London' })
    await page.getByLabel('Team:').selectOption({ label: 'Test Approved Premises Team' })
    await page
        .getByLabel('Officer:')
        .selectOption({ label: `${person.lastName}, ${person.firstName} (CRC - Additional Grade)` })
    await page.locator('input', { hasText: 'Save' }).click()
}
