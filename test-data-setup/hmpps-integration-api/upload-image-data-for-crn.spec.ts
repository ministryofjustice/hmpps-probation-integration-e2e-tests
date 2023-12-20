import { test, expect, PageScreenshotOptions} from '@playwright/test'
import config from "../../playwright.config";
import {
    captureScreenshotAsBuffer,
    createAndBookPrisoner,
    releasePrisoner,
    uploadImageFromBuffer
} from "../../steps/api/dps/prison-api";
import {login as loginDelius} from "../../steps/delius/login";
import {deliusPerson} from "../../steps/delius/utils/person";
import {createOffender} from "../../steps/delius/offender/create-offender";
import * as path from "path";
import fs from "fs";

test("Create and upload a synthetic facial image for offender", async({ page }) => {
    //URL based on content from the following sources:
    //https://github.com/ministryofjustice/prison-api/blob/02c0e3b842848dfa330bd01497d5e0a5b6fceaf6/README.MD?plain=1#L193C6-L204

    //File Retrieval
    const fileName = "personDoesNotExist.png"
//    const filePath = path.resolve(config.testDir, fileName)
    const url = "https://thispersondoesnotexist.com/"
    await captureScreenshotAsBuffer(page, url, fileName)
    const stream = fs.createReadStream(fileName);

    //Offender Creation and upload
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    console.log(person)
    await uploadImageFromBuffer(nomisId, stream)
    console.log("Has the image uploaded?")
    await releasePrisoner(nomisId)
})

