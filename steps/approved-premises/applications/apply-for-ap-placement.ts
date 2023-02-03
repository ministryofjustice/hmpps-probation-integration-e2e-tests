import {type Page, expect} from '@playwright/test'

export const clickTypeOfAPRequiredLink = async (page: Page) => {
    await page.locator('a', {hasText: 'Type of AP required'}).click()
    await expect(page.locator('#main-content h1')).toContainText('Which type of AP does')
}

export const clickChooseSectionsOfOASysToImportLink = async (page: Page) => {
    await page.locator('a', {hasText: 'Choose sections of OASys to import'}).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        'Which of the following sections of OASys do you want to import?'
    )
}

export const verifyRoshScoresAreAsPerOasys = async (page: Page) => {
    await expect(page.locator(`td:right-of(:text-is("Children"))`).first()).toHaveText('Very high');
    await expect(page.locator(`td:right-of(:text-is("Public"))`).first()).toHaveText('Medium');
    await expect(page.locator(`td:right-of(:text-is("Known adult"))`).first()).toHaveText('High');
    await expect(page.locator(`td:right-of(:text-is("Staff"))`).first()).toHaveText('Medium');
}
