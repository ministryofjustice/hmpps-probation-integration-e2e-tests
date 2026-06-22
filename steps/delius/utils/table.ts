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
        // If there are multiple pages, our project is more likely to be closer to the last page
        const lastPageLocator = page.getByRole('link', { name: 'Last' })
        await expect(lastPageLocator, `Expected - ${content} - not found.`).toBeVisible()
        await lastPageLocator.click()
        await waitForAjax(page)
        // Now check for content or navigate back
        return getRowByContentPaginatedFromLast(page, tableLocator, content)
    }
}

async function getRowByContentPaginatedFromLast(page: Page, tableLocator: Locator, content: string): Promise<Locator> {
    const row = tableLocator.getByRole('row').filter({ hasText: content })

    try {
        await expect(row).toBeVisible()
        return row
    } catch {
        const previousPageLocator = page.getByRole('link', { name: 'Previous' })
        await expect(previousPageLocator, `Expected - ${content} - not found.`).toBeVisible()
        await previousPageLocator.click()
        await waitForAjax(page)
        return getRowByContentPaginatedFromLast(page, tableLocator, content)
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
