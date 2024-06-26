import { type Page, expect } from '@playwright/test'

export const login = async (page: Page, userType: UserType) => {
    const { username, password } = oasysUserConfig(userType)
    await page.goto(process.env.OASYS_URL)
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
    OPD,
    ApprovedPSORole,
    AccreditedProgrammesAssessment,
}

const oasysUserConfig = (userType: UserType) => {
    switch (userType) {
        case UserType.Booking:
            return { username: process.env.OASYS_USERNAME_BOOKING, password: process.env.OASYS_PASSWORD_BOOKING }
        case UserType.Timeline:
            return { username: process.env.OASYS_USERNAME_TIMELINE, password: process.env.OASYS_PASSWORD_TIMELINE }
        case UserType.RSR:
            return { username: process.env.OASYS_USERNAME_RSR, password: process.env.OASYS_PASSWORD_RSR }
        case UserType.OPD:
            return { username: process.env.OASYS_USERNAME_OPD, password: process.env.OASYS_PASSWORD_OPD }
        case UserType.Assessment:
            return { username: process.env.OASYS_USERNAME_ASSESSMENT, password: process.env.OASYS_PASSWORD_ASSESSMENT }
        case UserType.ApprovedPSORole:
            return {
                username: process.env.OASYS_USERNAME_APPROVEDPSOROLE,
                password: process.env.OASYS_PASSWORD_APPROVEDPSOROLE,
            }
        case UserType.AccreditedProgrammesAssessment:
            return {
                username: process.env.OASYS_USERNAME_ACCREDITED_PROGRAMMES,
                password: process.env.OASYS_PASSWORD_ACCREDITED_PROGRAMMES,
            }
    }
}
