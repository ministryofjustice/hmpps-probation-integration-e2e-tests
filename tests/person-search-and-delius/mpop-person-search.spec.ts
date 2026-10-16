import { expect, test, type Page } from '@playwright/test'
import { login as mpopLogin } from '../../steps/manage-a-supervision/login'
import { fieldSearches, nameSearches, noResultSearches, searchData } from '../../test-data/search-data'

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

for (const { name, term } of nameSearches) {
    test(name, async ({ page }) => {
        await search(page, term)
        await expect(personLink(page)).toBeVisible()
    })
}

test('can search by CRN', async ({ page }) => {
    await search(page, searchData.crn)
    await expect(page.getByRole('cell', { name: searchData.crn }).first()).toBeVisible()
})

for (const { name, term, expectedText } of fieldSearches) {
    test(name, async ({ page }) => {
        await search(page, term)
        await expect(resultLinks(page).first()).toBeVisible()
        await expect(page.locator('.probation-search__results-container').getByText(expectedText).first()).toBeVisible()
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
    await search(page, searchData.place)
    await expect(
        page
            .locator('.govuk-tag--yellow')
            .filter({ hasText: new RegExp(`^${searchData.place}$`, 'i') })
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

for (const { name, term } of noResultSearches) {
    test(name, async ({ page }) => {
        await search(page, term)
        await expect(page.getByText(noResultsMessage)).toBeVisible()
        await expect(resultLinks(page)).toHaveCount(0)
    })
}

test('shows search results count', async ({ page }) => {
    await search(page, searchData.place)
    await expect(page.getByText(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
})

test('can navigate search result pages', async ({ page }) => {
    await search(page, searchData.place)
    await expect(page.getByText(/Showing\s+1\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
    await page.getByRole('link', { name: 'Next page' }).click()
    await expect(page).toHaveURL(/[?&]page=2(&|$)/)
    await expect(page.getByText(/Showing\s+11\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
    await expect(resultLinks(page).first()).toBeVisible()
})
