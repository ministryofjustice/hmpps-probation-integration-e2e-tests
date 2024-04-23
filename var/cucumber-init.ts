import { Before, After, BeforeAll, AfterAll, setWorldConstructor, setDefaultTimeout, World } from '@cucumber/cucumber'
import {
    chromium,
    ChromiumBrowser,
    firefox,
    FirefoxBrowser,
    webkit,
    WebKitBrowser,
    ConsoleMessage,
    LaunchOptions,
} from '@playwright/test'
import { BrowserContext, Page } from '@playwright/test'
import * as dotenv from 'dotenv'

dotenv.config() // read environment variables into process.env

/* extending the World constructor allows us to pass the browser instance */
interface IMyWorld extends World {
    context?: BrowserContext
    page?: Page
}

class MyWorld extends World implements IMyWorld {
    constructor(options) {
        super(options)
    }
    context?: BrowserContext
    page?: Page
}

setWorldConstructor(MyWorld)
setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000)

const browserOptions: LaunchOptions = {
    slowMo: 0,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
    firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true,
    },
}

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser

BeforeAll(async () => {
    switch (process.env.BROWSER) {
        case 'firefox':
            browser = await firefox.launch(browserOptions)
            break
        case 'webkit':
            browser = await webkit.launch(browserOptions)
            break
        default:
            browser = await chromium.launch(browserOptions)
    }
})

Before({ tags: '@ignore' }, async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return 'skipped' as any
})

Before(async function (this) {
    const context = (this.context = await browser.newContext({
        acceptDownloads: true,
        recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
        viewport: { width: 1200, height: 800 },
    }))

    const page = (this.page = await context.newPage())
    page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() === 'log') {
            this.attach(msg.text())
        }
    })
})

After(async function (this) {
    await this.page?.close()
    await this.context?.close()
})

AfterAll(() => browser.close())
