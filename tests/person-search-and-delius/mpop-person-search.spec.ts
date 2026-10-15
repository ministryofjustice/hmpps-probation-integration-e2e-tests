import { expect, test, type Page } from '@playwright/test'
import { login as mpopLogin } from '../../steps/manage-a-supervision/login'
import { searchData } from '../../test-data/search-data'

const personLink = (page: Page) =>
    page.getByRole('link', {
        name: new RegExp(`^(${searchData.resultName}|${searchData.resultName2})\\b`),
    })

const resultLinks = (page: Page) => page.locator('.probation-search__results-container a[title^="Select case record"]')

const noResultsMessage = 'There are no results for your search. Try refining your query above.'

const search = async (page: Page, term: string) => {
    await page.getByLabel('Find a person on probation').fill(term)
    await page.getByRole('button', { name: 'Search', exact: true }).click()
}

test.beforeEach(async ({ page }) => {
    await mpopLogin(page)
    await page.getByRole('link', { name: 'Search' }).click()
    await expect(page.getByLabel('Find a person on probation')).toBeVisible()
})

test('can search by person name', async ({ page }) => {
    await search(page, searchData.fullName)
    await expect(personLink(page)).toBeVisible()
})

test('can search by CRN', async ({ page }) => {
    await search(page, searchData.crn)
    await expect(page.getByRole('cell', { name: searchData.crn }).first()).toBeVisible()
})

for (const { name, term } of [
    { name: 'can search by date of birth', term: searchData.dateOfBirth },
    { name: 'can search by telephone number', term: searchData.telephoneNumber },
    { name: 'can search by postcode', term: searchData.postcode },
]) {
    test(name, async ({ page }) => {
        await search(page, `Christina Grady ${term}`)
        await expect(personLink(page)).toBeVisible()
    })
}

test('can search using partial name', async ({ page }) => {
    await search(page, searchData.partialName)
    // A partial name can match many people, so check the results match rather than a specific person
    await expect(
        page.getByRole('link', { name: new RegExp(`\\b${searchData.partialName}\\b`, 'i') }).first()
    ).toBeVisible()
})

test('highlights matching keyword in results', async ({ page }) => {
    await search(page, searchData.keyword)
    await expect(
        page
            .locator('.govuk-tag--yellow')
            .filter({ hasText: new RegExp(`^${searchData.keyword}$`, 'i') })
            .first()
    ).toBeVisible()
})

for (const { name, term } of [
    { name: 'shows validation when search is empty', term: '' },
    { name: 'shows validation for whitespace only', term: '      ' },
]) {
    test(name, async ({ page }) => {
        await search(page, term)
        await expect(page.getByText(/enter a search term/i).first()).toBeVisible()
        await expect(resultLinks(page)).toHaveCount(0)
    })
}

test('shows no results message', async ({ page }) => {
    await search(page, searchData.noMatch)
    await expect(page.getByText(noResultsMessage)).toBeVisible()
})

for (const [caseName, term] of [
    ['lower', searchData.fullName.toLowerCase()],
    ['upper', searchData.fullName.toUpperCase()],
]) {
    test(`search is case insensitive (${caseName} case)`, async ({ page }) => {
        await search(page, term)
        await expect(personLink(page)).toBeVisible()
    })
}

test('handles special characters', async ({ page }) => {
    await search(page, searchData.specialCharacters)
    await expect(page.getByText(noResultsMessage)).toBeVisible()
    await expect(resultLinks(page)).toHaveCount(0)
})

test('shows search results count', async ({ page }) => {
    await search(page, searchData.keyword)
    await expect(page.getByText(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
})

test('can navigate search result pages', async ({ page }) => {
    await search(page, searchData.keyword)
    await expect(page.getByText(/Showing\s+1\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
    await page.getByRole('link', { name: 'Next page' }).click()
    await expect(page).toHaveURL(/[?&]page=2(&|$)/)
    await expect(page.getByText(/Showing\s+11\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
    await expect(resultLinks(page).first()).toBeVisible()
})
