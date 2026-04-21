import { expect, Locator, Page } from '@playwright/test'
import { waitForAjax } from './refresh'

export async function getRowByContent(page: Page, tableId: string, content: string): Promise<Locator> {
    const tableLocator = page.locator(`#${tableId}`)
    await expect(tableLocator).toBeVisible()
    const row = tableLocator.getByRole('row').filter({ hasText: content })

    try {
        await expect(row).toBeVisible()
        return row
    } catch {
        const nextPageButtonLocator = page.getByRole('link', { name: 'Next' })
        await expect(nextPageButtonLocator, `Expected - ${content} - not found, try next page`).toBeVisible()
        await nextPageButtonLocator.click()
        await waitForAjax(page)
        return getRowByContent(page, tableId, content)
    }
}

export async function getRowCellsByContent(page: Page, tableId: string, content: string): Promise<string[]> {
    const row = await getRowByContent(page, tableId, content)
    return await row.getByRole('cell').allTextContents()
}

export async function verifyTableRowByContent(
    page: Page,
    tableId: string,
    rowIdentifyingContent: string,
    toVerify: Array<{ columnName: string; cellContent: string }>
) {
    const tableLocator = page.locator(`#${tableId}`)
    const rowCellsByContent = await getRowCellsByContent(page, tableId, rowIdentifyingContent)
    const headerRowCells = await tableLocator.getByRole('columnheader').allTextContents()
    toVerify.forEach(verification => {
        const columnIndex = headerRowCells.findIndex(cell => cell.includes(verification.columnName))
        expect(rowCellsByContent[columnIndex]).toContain(verification.cellContent)
    })
}
