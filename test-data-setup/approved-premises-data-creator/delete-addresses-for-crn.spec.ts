import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { deleteAddresses } from '../../steps/delius/address/delete-addresses'

test('Delete previous addresses for a given offender', async ({ page }) => {
    await loginDelius(page)
    const crn: string = process.env.OFFENDER_CRN
    await deleteAddresses(page, crn)
})
