import { expect, type Page } from '@playwright/test'

export const assessApplication = async (page: Page, personName: string) => {
    await page.getByRole('link', { name: 'Assess' }).click()
    await expect(page.locator('h1')).toHaveText('Approved Premises applications')
    await page.getByRole('link', { name: personName }).click()
    await expect(page.locator('h1')).toHaveText('Assess an Approved Premises (AP) application')
    await page.getByRole('link', { name: 'Review application and documents' }).click()
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('link', { name: 'Check there is sufficient information to make a decision' }).click()
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('link', { name: 'Assess suitability of application' }).click()
    await page.locator('#riskFactors').check()
    await page.locator('#riskManagement').check()
    await page.locator('#locationOfPlacement').check()
    await page.locator('#moveOnPlan').check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.locator('.govuk-heading-l')).toHaveText('Application timeliness')
    await page
        .getByRole('group', {
            name: "Do you agree with the applicant's reason for submission outside of National Standards timescales?",
        })
        .getByLabel('Yes')
        .check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page
        .getByRole('group', {
            name: 'Is the contingency plan sufficient to manage behaviour or a failure to return out of hours?',
        })
        .getByLabel('No')
        .check()
    await page.getByLabel('Additional comments').fill('Test contingency plan comments')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('link', { name: 'Provide any requirements to support placement' }).click()
    await page
        .getByRole('group', {
            name: 'Are there any additional actions required by the probation practitioner to make a placement viable?',
        })
        .getByLabel('Yes')
        .check()
    await page
        .getByRole('group', { name: 'Are any additional curfews or sign ins recommended?' })
        .getByLabel('No')
        .check()
    await page
        .getByRole('group', {
            name: 'Are there concerns that the person poses a potentially unmanageable risk to staff or others?',
        })
        .getByLabel('No')
        .check()
    await page
        .getByRole('group', { name: 'Are there any additional recommendations for the receiving AP manager?' })
        .getByLabel('No')
        .check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('link', { name: 'Make a decision', exact: true }).click()
    await page.getByLabel('Accept').check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('link', { name: 'Matching information' }).click()
    await page.getByLabel('Standard AP').check()
    await page.getByLabel('Is wheelchair designated notRelevant').check()
    await page.getByLabel('Is single notRelevant').check()
    await page.getByLabel('Is step free designated notRelevant').check()
    await page.getByLabel('Is catered notRelevant').check()
    await page.getByLabel('Has en suite notRelevant').check()
    await page.getByLabel('Is suited for sex offenders notRelevant').check()
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('link', { name: 'Check assessment answers' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByLabel('I confirm the information provided is complete, accurate and up to date.').check()
    await page.getByRole('button', { name: 'Submit assessment' }).click()
    await expect(page.locator('#main-content h1')).toContainText('You have marked this application as suitable.')
}
