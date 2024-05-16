import {expect, type Page, test} from '@playwright/test'
import * as dotenv from 'dotenv'
import {data} from '../../test-data/test-data'
import {login as deliusLogin} from "../../steps/delius/login.js";
import {recallPrisoner, releasePrisoner} from "../../steps/api/dps/prison-api.js";
import {discardAllLicences} from "../../steps/api/cvl/cvl-api.js";
import {deleteLicenceConditions} from "../../steps/delius/licence-condition/delete-licence-condition.js";
import {refreshUntil} from "../../steps/delius/utils/refresh.js";
import {approveLicence, createLicence} from "../../steps/cvl-licences/application.js";
import {
    deliusLicenceCondition,
    navigateToLicenceConditions
} from "../../steps/delius/licence-condition/create-licence-condition.js";

dotenv.config() // read environment variables into process.env

test('View case in Create and Vary a Licence', async ({page}) => {
    const {crn, nomsNumber} = data.prisoners.sentencedPrisonerWithReleaseDate;

    // Check if the CRN is in the right state (no active licence to release, and the offender is still in prison).
    // Recall the prisoner to put the CRN in the right state and discard all existing licences.
    await resetLicenceCase(page);

    // Delete the existing licence conditions in Delius.
    await deliusLogin(page);
    await deleteLicenceConditions(page, crn);

    // Create a licence in CVL and approve it.
    await createLicence(page, crn, nomsNumber);
    await approveLicence(page, crn, nomsNumber);

    // Release the prisoner to apply the licence conditions.
    await releasePrisoner(nomsNumber);

    // Verify that the licence condition appears in Delius.
    await deliusLogin(page);
    await navigateToLicenceConditions(page, crn);
    await refreshUntil(page, () =>
            expect(page.locator(deliusLicenceCondition)).toHaveText('Standard 9 Conditions - Standard 9 Conditions'),
        {timeout: 120_000});
});

const resetLicenceCase = async (page: Page) => {
    //Recall the prisoner and discard all the existing licences
    try {
        await recallPrisoner(data.prisoners.sentencedPrisonerWithReleaseDate.nomsNumber)
    } catch (e) {
        console.log("Recall Failed, Likely to be already in the prison")
    }
    await discardAllLicences(data.prisoners.sentencedPrisonerWithReleaseDate.crn)
}
