import {test, expect, Page} from '@playwright/test';
// @ts-ignore
import dotenv from 'dotenv';
import {login} from "../../steps/delius/login";
import {createOffender} from "../../steps/delius/create-offender";
import {createSentenceEventForCRN} from "../../steps/delius/create-event";

test.beforeEach(async ({page}) => {
    page.on('console', msg => console.log(msg.text()))
    await login(page);
});

test('Create offender', async ({page}) => {
    const crn = await createOffender(page)
    await createSentenceEventForCRN(page, crn)
    console.log('CRN=',crn)
});