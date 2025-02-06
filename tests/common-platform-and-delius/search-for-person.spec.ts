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
        'hmpps-probation-integration',
        'probation-integration-e2e-test',
        'probation-integration',
        ['aws sqs send-message --queue-url "$QUEUEURL" --message-body "$MESSAGEBODY"'],
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
    await expect(page.locator('span:right-of(:text("First Name"))').first()).toContainText(person.firstName)
    await expect(page.locator('span:right-of(:text("Surname or Family Name"))').first()).toContainText(person.lastName)
    await expect(page.locator('span:right-of(:text("Sex"))').first()).toContainText(person.sex)
    await expect(page.locator('span:right-of(:text("Date of Birth"))').first()).toContainText(
        DateTime.fromJSDate(person.dob).toFormat('dd/MM/yyyy')
    )
    await expect(page.locator('span:right-of(:text("PNC Number"))').first()).toContainText(person.pnc)

    // Check address record has been created
    await page.getByRole('link', { name: 'Addresses' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await expect(page.locator('span:right-of(:text("Street Name"))').first()).toContainText(address.streetAddress)
    await expect(page.locator('span:right-of(:text("District"))').first()).toContainText(address.cityName)
    await expect(page.locator('span:right-of(:text("Town/City"))').first()).toContainText(address.county)
    await expect(page.locator('span:right-of(:text("County"))').first()).toContainText(address.country)
    await expect(page.locator('span:right-of(:text("Postcode"))').first()).toContainText(address.zipCode)

    // Check Event List + Details
    await page.getByRole('link', { name: 'Event List' }).click();
    await expect(page.locator('tbody')).toContainText('Sheffield Magistrates Court');
    await expect(page.locator('tbody')).toContainText('Pre-Sentence');
    await expect(page.locator('tbody')).toContainText('Remanded In Custody');
    await page.getByRole('link', { name: 'view', exact: true }).click();
    await expect(page.locator('span:right-of(:text("Court"))').first()).toContainText('Sheffield Magistrates Court')

    // Check Court Appearance List + Details
    await page.getByRole('link', { name: 'Court Appearances' }).click();
    await expect(page.locator('tbody')).toContainText('Trial/Adjournment');
    await page.getByRole('cell', { name: 'Sheffield Magistrates Court' }).click();
    await page.getByRole('link', { name: 'view', exact: true }).click();
    await expect(page.locator('span:right-of(:text("Court:"))').first()).toContainText('Sheffield Magistrates Court')
    await expect(page.locator('span:right-of(:text("Appearance Type"))').first()).toContainText('Trial/Adjournment')
    await expect(page.locator('span:right-of(:text("Outcome"))').first()).toContainText('Remanded In Custody')

    // Check Contact List
    await page.getByRole('link', { name: 'Contact List' }).click();
    await expect(page.locator('tbody')).toContainText('Court Appearance');
    await expect(page.locator('tbody')).toContainText('1 - Not Sentenced');
})
