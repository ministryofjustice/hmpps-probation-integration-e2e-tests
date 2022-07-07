import {test, expect, Page} from '@playwright/test';
// @ts-ignore
import dotenv from 'dotenv';
import {login} from "../../steps/delius/login";
import {createOffender} from "../../steps/delius/create-offender";
import {createSentenceEventForCRN} from "../../steps/delius/create-event";
import {createRequirementForEvent} from "../../steps/delius/create-requirement";


test.beforeEach(async ({page}) => {
    page.on('console', msg => console.log(msg.text()))
    await login(page);
});

test('Create offender with event and requirement', async ({page}) => {
    const crn = await createOffender(page)
    await createSentenceEventForCRN(page, crn)
    await createRequirementForEvent(page, crn)
    console.log('CRN=',crn)
});