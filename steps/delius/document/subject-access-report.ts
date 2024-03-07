import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../utils/refresh'
import { findOffenderByCRN } from '../offender/find-offender'
import StreamZip from 'node-stream-zip'

export async function createSubjectAccessReport(page: Page, crn, downloadLocation: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('#navigation-include\\:linkNavigation2SubjectAccessReportList').click()
    await page.locator('input', { hasText: 'New SAR' }).click()
    await page.locator('input', { hasText: 'Save' }).click()
    const sarProgressTable = page.locator('#sarListForm\\:subjectAccessReportTable')
    await refreshUntil(page, () => expect(sarProgressTable).toContainText('Complete'))
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        sarProgressTable.locator('a', { hasText: 'Download' }).click(),
    ])
    await download.saveAs(downloadLocation)
}

export async function getFileFromZip(downloadLocation: string, filename: RegExp): Promise<Buffer> {
    const zip = new StreamZip.async({ file: downloadLocation })
    const matchingFiles = Object.values(await zip.entries()).filter(entry => entry.isFile && filename.test(entry.name))
    expect(matchingFiles).toHaveLength(1)
    return zip.entryData(matchingFiles[0])
}
