import { Page, expect } from "@playwright/test";
import * as dotenv from "dotenv";

export const login = async (page: Page) => {
    dotenv.config()
    await page.goto(process.env.DPS_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill("id=username", process.env.DPS_USERNAME!!)
    await page.fill("id=password", process.env.DPS_PASSWORD!!)
    await page.click("id=submit")
    await expect(page).toHaveTitle(/Home - Digital Prison Services/)
}
