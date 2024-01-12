import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3AssessmentWithoutNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { createCustodialEvent } from '../../steps/delius/event/create-event'

test('OPD assessment creates an event in Delius', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createCustodialEvent(page, { crn })
    await page.pause()
    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn)
    await addLayer3AssessmentNeeds(page)
})
