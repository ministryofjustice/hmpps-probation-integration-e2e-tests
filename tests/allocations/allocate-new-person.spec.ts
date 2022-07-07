import {test} from '@playwright/test';
import {login} from "../../steps/delius/login";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {createEventForCRN} from "../../steps/delius/event/create-event";
import {createRequirementForEvent} from "../../steps/delius/requirement/create-requirement";


test.beforeEach(async ({page}) => {
    await login(page);
});

test('Create offender with event and requirement', async ({page}) => {
    const crn = await createOffender(page)
    await createEventForCRN(page, crn)
    await createRequirementForEvent(page, crn, '1')
});

test('Create offender with event and requirement2', async ({page}) => {
    const crn = await createOffender(page)
    await createEventForCRN(page, crn)
    await createRequirementForEvent(page, crn, '1')
});

test('Create offender with event and requirement3', async ({page}) => {
    const crn = await createOffender(page)
    await createEventForCRN(page, crn)
    await createRequirementForEvent(page, crn, '1')
});