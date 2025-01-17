import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { runPod } from '../../steps/k8s/k8s-utils'
import { DateTime } from 'luxon'
import { hearingData } from '../../steps/court-case/hearing-data'
import { buildAddress } from '../../steps/delius/address/create-address'

dotenv.config() // read environment variables into process.env

test('Create and search for a person', async ({ page }) => {
    const person = deliusPerson()
    const address = buildAddress()

    await runPod(
        'hmpps-probation-integration-services-dev',
        'probation-integration-e2e-test',
        'common-platform-and-delius',
        ['aws sqs send-message --queue-url "$QUEUEURL" --message-body "$MESSAGEBODY" || sleep 30'],
        [
            {
                name: 'QUEUEURL',
                value: 'https://eu-west-2.queue.amazonaws.com/754256621582/probation-integration-dev-common-platform-and-delius-queue',
            },
            {
                name: 'MESSAGEBODY',
                value: JSON.stringify({
                    Message: JSON.stringify(hearingData(person, address)),
                }),
            },
        ]
    )

    await deliusLogin(page)
    // Search for created person record via national search screen
    await page.getByRole('link', { name: 'National Search' }).click()
    await page.getByLabel('First Name or Preferred Name:').fill(person.firstName)
    await page.getByLabel('Last Name:').fill(person.lastName)
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    await expect(page.getByRole('cell', { name: person.lastName + ', ' + person.firstName, exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'View' }).nth(2).click()

    // Check personal details screen information is correct
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await expect(page.locator('[id="FirstName\\:outputText"]')).toContainText(person.firstName)
    await expect(page.locator('[id="Surname\\:outputText"]')).toContainText(person.lastName)
    await expect(page.locator('[id="Sex\\:outputText"]')).toContainText(person.sex)
    await expect(page.locator('[id="DateOfBirth\\:DateOfBirth\\:outputText"]')).toContainText(
        DateTime.fromJSDate(person.dob).toFormat('dd/MM/yyyy')
    )
    await expect(page.locator('[id="PNC\\:outputText"]')).toContainText(person.pnc)

    // Check address record has been created
    await page.getByRole('link', { name: 'Addresses' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await expect(page.locator('[id="j_idt714\\:outputText"]')).toContainText(address.streetAddress)
    await expect(page.locator('[id="j_idt718\\:outputText"]')).toContainText(address.cityName)
    await expect(page.locator('[id="j_idt722\\:outputText"]')).toContainText(address.county)
    await expect(page.locator('[id="j_idt726\\:outputText"]')).toContainText(address.country)
    await expect(page.locator('[id="j_idt730\\:outputText"]')).toContainText(address.zipCode)
})