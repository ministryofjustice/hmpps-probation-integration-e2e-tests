import { type Page, expect } from '@playwright/test'

export const clickTypeOfAPRequiredLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Type of AP required' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Which type of AP does')
}

export const clickChooseSectionsOfOASysToImportLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Choose sections of OASys to import' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'Which of the following sections of OASys do you want to import?'
    )
}

export const clickAddDetailsManagingRisksNeedsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Add detail about managing risks and needs' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'What features of an Approved Premises (AP) will support the management of risk?'
    )
}

export const clickreviewPrisoninformationLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Review prison information' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Prison information')
}

export const clickDescribeLocationFactorsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Describe location factors' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Location factors')
}

export const clickAddAccessCulturalHealthcareNeedsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Add access, cultural and healthcare needs' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Access, cultural and healthcare needs')
}

export const clickDtlFrtherConsidPlacementLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Detail further considerations for placement' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Further placement considerations')
    await expect(page.locator('#main-content h1')).toContainText('Room sharing')
}

export const clickAddMoveOnInfoLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Add move on information' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Placement duration and move on')
    await expect(page.locator('#main-content form > h3')).toContainText('What duration of placement do you recommend?')
}

export const clickAttachRqrdDocumentsLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Attach required documents' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Select any additional documents that are required to support your application')
}

export const clickCheckYourAnswersLink = async (page: Page) => {
    await page.locator('a', { hasText: 'Check your answers' }).click()
    await expect(page.locator('#main-content h1')).toContainText('Check your answers')
}

export const verifyRoshScoresAreAsPerOasys = async (page: Page) => {
    await expect(page.locator(`td:right-of(:text-is("Children"))`).first()).toHaveText('Very high')
    await expect(page.locator(`td:right-of(:text-is("Public"))`).first()).toHaveText('Medium')
    await expect(page.locator(`td:right-of(:text-is("Known adult"))`).first()).toHaveText('High')
    await expect(page.locator(`td:right-of(:text-is("Staff"))`).first()).toHaveText('Medium')
}
