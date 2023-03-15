import { format } from 'date-fns'
import {Page} from "@playwright/test";

export const splitDate = (date: Date) => {
    return format(date, 'dd MM yyyy').split(' ')
}
export const waitForJS = (page:Page, timeout: number = 0) =>  {
        const timeToWait =  (timeout: number) => new Promise((resolve)=> setTimeout(resolve, timeout))
    return page.evaluate(timeToWait, timeout)
}
