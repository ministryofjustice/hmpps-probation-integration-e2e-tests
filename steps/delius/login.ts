import { Page, expect } from "@playwright/test";
// @ts-ignore
import dotenv from "dotenv";

export const login = async (page: Page) => {
    dotenv.config()
    await page.goto(process.env.DELIUS_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill("id=username", process.env.DELIUS_USERNAME!!)
    await page.fill("id=password", process.env.DELIUS_PASSWORD!!)
    await page.click("id=submit")
    await expect(page).toHaveTitle(/National Delius Home Page/)
}
