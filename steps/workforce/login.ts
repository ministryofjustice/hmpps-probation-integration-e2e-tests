import { Page, expect } from "@playwright/test";
import * as dotenv from "dotenv";

export const login = async (page: Page) => {
    dotenv.config()
    await page.goto(process.env.WORKFORCE_URL)
    await expect(page).toHaveTitle(/.*Manage a workforce/)
}
