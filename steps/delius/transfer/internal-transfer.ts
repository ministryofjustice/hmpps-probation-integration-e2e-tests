import {expect, Page} from "@playwright/test";
import {findEventByCRN} from "../event/find-events";
import {selectOption} from "../utils/inputs";
import {findOffenderByCRN} from "../offender/find-offender";

export async function internalTransfer(
    page: Page,
    {crn, allocation, reason = "Initial Allocation"}: {
        crn: string,
        allocation?: {
            providerName?: string
            teamName?: string;
            staffName?: string;
        };
        reason?: string,
    }
) {
    await findOffenderByCRN(page, crn)
    await page.locator("input", {hasText: "Transfers"}).click();
    await expect(page).toHaveTitle(/Consolidated Transfer Request/);

    await selectOption(page, "id=offenderTransferRequestListForm:Trust", allocation.providerName)
    await selectOption(page, "id=offenderTransferRequestListForm:Team", allocation.teamName)
    await selectOption(page, "id=offenderTransferRequestListForm:Staff", allocation.staffName)

    const options = await page.locator("id=offenderTransferRequestListForm:offenderTransferRequestTable")
        .locator("select")

    const count = await options.count();
    for (let i = 0; i < count; i++) {
        await options.nth(i).selectOption({label: reason});
    }

    await page.locator("input", {hasText: "Transfer"}).click();
    await expect(page).toHaveTitle(/Consolidated Transfer Request/);
}