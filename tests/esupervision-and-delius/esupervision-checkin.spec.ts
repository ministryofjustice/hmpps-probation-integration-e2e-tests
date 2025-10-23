import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as hmppsAuthLogin } from '../../steps/hmpps-auth/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import { deleteOffender } from '../../steps/delius/offender/delete-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createCheckin, registerCase, reviewCheckin } from '../../steps/esupervision/check-in'

const person = deliusPerson()
let crn: string

test('Check-in for an e-supervision appointment', async ({ page }) => {
    // Given a case in Delius with an active event
    await deliusLogin(page)
    crn = await createOffender(page, { person })
    await createCommunityEvent(page, { crn })

    // When the case is registered in e-supervision
    const uuid = await registerCase(page, person, crn)
    // And the person checks in for their appointment
    await createCheckin(page, uuid, person)
    // And a practitioner reviews their check-in
    await reviewCheckin(page, person)

    // Then I can see the contact in Delius
    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('1 - ORA Community Order', 'Online check in completed')])
})

test.afterEach(async ({ page }) => {
    // Stop check-ins
    await hmppsAuthLogin(page)
    await page.goto(process.env.ESUPERVISION_URL)
    await page.getByRole('link', { name: 'Cases' }).click()
    await page.getByRole('link', { name: `Manage ${person.firstName} ${person.lastName}` }).click({ timeout: 5000 })
    await page.getByRole('link', { name: 'Stop check ins' }).click()
    await page.getByRole('radio', { name: 'Yes' }).check()
    await page.getByRole('textbox', { name: /Explain the reason/ }).fill('Testing')
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.locator('#main-content')).toContainText('Check-ins stopped')
    // Delete the offender from Delius
    await deliusLogin(page)
    await deleteOffender(page, crn)
})
