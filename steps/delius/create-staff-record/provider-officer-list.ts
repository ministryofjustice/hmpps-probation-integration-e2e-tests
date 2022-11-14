import { expect, type Page } from '@playwright/test'
import {type Person} from "../utils/person.js";

const addButton = "input[title='Select to Add a Provider Officer']";

export const ClickAddToAddProviderOfficer = async (page: Page) => {
    await page.click("input[title='Select to Add a Provider Officer']")
    await expect(page.locator('#content > h1')).toHaveText('Add Provider Officer')

}

export const searchProviderOfficer = async (page: Page, person: Person ) => {
    await page.fill("#SearchForm\\:Surname", person.lastName)
    await page.click("[title='Select this option to search the officer list']")
    await expect(page.locator('#SearchForm\\:staffTable')).toContainText(`${person.lastName}, ${person.firstName}`)

}

export const clickUpdateButton = async (page: Page) => {
    await page.click("[title='Select to Update the Officer record']")
    await expect(page.locator('#content > h1')).toContainText('Update Provider Officer')

}
