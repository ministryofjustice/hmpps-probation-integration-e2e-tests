import { expect, test, type FrameLocator, type Page } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { fieldSearches, nameSearches, noResultSearches, searchData } from '../../test-data/search-data'

const searchComponent = (page: Page) => page.frameLocator('#elasticsearch-frame')

// Person component link
const personLink = (component: FrameLocator) =>
    component.getByRole('link', {
        name: new RegExp(`^(${searchData.resultName}|${searchData.resultName2})\\b`),
    })

const search = async (component: FrameLocator, term: string) => {
    // Results update as you type, so there is no Search button to click
    await component.locator('#search').fill(term)
}

test.beforeEach(async ({ page }) => {
    await deliusLogin(page)
    await page.getByRole('link', { name: /New Search/i }).click()
    await expect(searchComponent(page).locator('#search')).toBeVisible()
})

for (const { name, term } of nameSearches) {
    test(name, async ({ page }) => {
        const component = searchComponent(page)
        await search(component, term)
        await expect(personLink(component)).toBeVisible()
    })
}

test('can search by CRN', async ({ page }) => {
    const component = searchComponent(page)
    await search(component, searchData.crn)
    await expect(component.getByText(searchData.crn).first()).toBeVisible()
})

for (const { name, term, expectedText } of fieldSearches) {
    test(name, async ({ page }) => {
        const component = searchComponent(page)
        await search(component, term)
        await expect(component.locator('.view-offender-link').first()).toBeVisible()
        await expect(component.getByText(expectedText).first()).toBeVisible()
    })
}

test('can search using partial name', async ({ page }) => {
    const component = searchComponent(page)
    await search(component, searchData.partialName)
    // A partial name can match many people, so check the results match rather than a specific person
    await expect(
        component.getByRole('link', { name: new RegExp(`\\b${searchData.partialName}\\b`, 'i') }).first()
    ).toBeVisible()
})

test('highlights matching keyword in results', async ({ page }) => {
    const component = searchComponent(page)
    await search(component, searchData.place)
    await expect(
        component
            .locator('.highlighted-text')
            .filter({ hasText: new RegExp(`^${searchData.place}$`, 'i') })
            .first()
    ).toBeVisible()
})

for (const { name, term } of [
    { name: 'does not search when search is empty', term: '' },
    { name: 'does not search for whitespace only', term: '      ' },
]) {
    test(name, async ({ page }) => {
        const component = searchComponent(page)
        await search(component, term)
        await expect(component.getByText(/Showing \d+ to \d+ of \d+ results/)).toBeHidden()
        await expect(component.locator('.view-offender-link')).toHaveCount(0)
    })
}

for (const { name, term } of noResultSearches) {
    test(name, async ({ page }) => {
        const component = searchComponent(page)
        await search(component, term)
        await expect(
            component.getByText('There are no results for your search. Try refining your query above.')
        ).toBeVisible()
        await expect(component.locator('.view-offender-link')).toHaveCount(0)
    })
}

test('shows search results count', async ({ page }) => {
    const component = searchComponent(page)
    await search(component, searchData.place)
    await expect(component.getByText(/Showing \d+ to \d+ of \d+ results/)).toBeVisible()
})

test('can navigate search result pages', async ({ page }) => {
    const component = searchComponent(page)
    await search(component, searchData.place)
    await expect(component.getByText(/Showing 1 to \d+ of \d+ results/)).toBeVisible()
    await component.getByRole('link', { name: 'Next page' }).click()
    await expect(component.getByText(/Showing 11 to \d+ of \d+ results/)).toBeVisible()
    await expect(component.locator('.view-offender-link').first()).toBeVisible()
})
