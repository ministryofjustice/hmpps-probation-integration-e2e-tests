import { format } from 'date-fns'
import {Page} from "@playwright/test";

export const splitDate = (date: Date) => {
    return format(date, 'dd MM yyyy').split(' ')
}

export const waitForJS = (page:Page) =>  page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 0)));
