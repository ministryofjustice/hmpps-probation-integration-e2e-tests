import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'

dotenv.config() // read environment variables into process.env

test('Create an OGRS Assessment in OASys and verify the score in nDelius', async ({ page }) => {
    // TODO write a test
    expect(true).toBeFalsy()
})
