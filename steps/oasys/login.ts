import { type Page, expect } from '@playwright/test'

export const login = async (page: Page, userType: UserType) => {

    // const t2Link = await page.$('a:has-text("T2 OASys")');
    // if (t2Link && await t2Link.isVisible()) {
    //     await t2Link.click();
    // }

    // const links = await page.$$('a');
    // for (const link of links) {
    //     const linkText = await link.textContent();
    //     if (linkText.includes('T2 OASys')) {
    //         await link.click();
    //         break;
    //     }
    // }

    const { username, password } = oasysUserConfig(userType)
    await page.goto(process.env.OASYS_URL)
    // await page.goto('https://ords.t2.oasys.service.justice.gov.uk/eor/f?p=100:101')
    // const links = await page.$$('a');
    // for (const link of links) {
    //     const linkText = await link.textContent();
    //     if (linkText.includes('T2 OASys')) {
    //         await link.click();
    //         break;
    //     }
    // }

    await expect(page.locator('#loginbodyheader > h2')).toHaveText('Login')
    await page.fill('#P101_USERNAME', username)
    await page.fill('#P101_PASSWORD', password)
    await page.click('#P101_LOGIN_BTN')
    // await expect(page.locator('#loginbodyheader > h2')).toHaveText('Provider/Establishment')
}

export enum UserType {
    Booking,
    Timeline,
    RSR,
    Assessment,
}

const oasysUserConfig = (userType: UserType) => {
    switch (userType) {
        case UserType.Booking:
            return { username: process.env.OASYS_USERNAME_BOOKING, password: process.env.OASYS_PASSWORD_BOOKING }
        case UserType.Timeline:
            return { username: process.env.OASYS_USERNAME_TIMELINE, password: process.env.OASYS_PASSWORD_TIMELINE }
        case UserType.RSR:
            return { username: process.env.OASYS_USERNAME_RSR, password: process.env.OASYS_PASSWORD_RSR }
        case UserType.Assessment:
            return { username: process.env.OASYS_USERNAME_ASSESSMENT, password: process.env.OASYS_PASSWORD_ASSESSMENT }
    }
}
