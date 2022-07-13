import {expect, Page} from "@playwright/test";
import {findEventByCRN} from "../event/find-events";
import {selectOption} from "../utils/inputs";
import {findOffenderByCRN} from "../offender/find-offender";

export async function internalTransfer(
    page: Page,
    args: {
        crn: string,
        providerName?: string
        teamName?: string,
        staffName?: string
        reason?: string,
    }
) {
    await findOffenderByCRN(page, args.crn)
    await page.locator("input", {hasText: "Transfers"}).click();
    await expect(page).toHaveTitle(/Consolidated Transfer Request/);

    await selectOption(page, "id=offenderTransferRequestListForm:Trust", args.providerName)
    await selectOption(page, "id=offenderTransferRequestListForm:Team", args.teamName)
    await selectOption(page, "id=offenderTransferRequestListForm:Staff", args.staffName)

    const options = await page.locator("id=offenderTransferRequestListForm:offenderTransferRequestTable")
        .locator("select")

    const count = await options.count();
    for (let i = 0; i < count; i++) {
        await options.nth(i).selectOption({label: args.reason});
    }

    await page.locator("input", {hasText: "Transfer"}).click();
    await expect(page).toHaveTitle(/Consolidated Transfer Request/);
}