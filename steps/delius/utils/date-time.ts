import { addMonths, addYears, addDays, subMonths, subDays, parse, format } from 'date-fns'
export const options = { day: 'numeric', month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions
export const recallDateFormatter = date => date.toLocaleDateString('en-GB', options)
export const DeliusDateFormatter = (date: Date) => date.toLocaleDateString('en-GB')
export const DeliusTimeFormatter = (time: Date) =>
    `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
export const EuropeLondonFormat = (date: Date) =>
    date.toLocaleString('sv', { timeZone: 'Europe/London' }).replace(' ', 'T')
export const get12Hour = (date: Date) => (date.getHours() > 12 ? date.getHours() - 12 : date.getHours())
export const getTimeOfDay = (date: Date) => (date.getHours() < 12 ? 'am' : 'pm')
export const formatRMDateToDelius = (dateTime: string): string => {
    const parsedDateTime = parse(dateTime, "h:mma 'on' d MMM yyyy", new Date())
    return format(parsedDateTime, 'dd/MM/yyyy HH:mm')
}

//Getting dates using date-fns lib
export const NextMonth = addMonths(new Date(), 1)
export const LastMonth = subMonths(new Date(), 1)
export const NextYear = addYears(new Date(), 1)
export const Tomorrow = addDays(new Date(), 1)
export const Yesterday = subDays(new Date(), 1)
