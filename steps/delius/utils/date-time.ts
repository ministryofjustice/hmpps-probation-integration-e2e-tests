import { addMonths, addYears, addDays, subMonths, subDays } from 'date-fns'

export const DeliusDateFormatter = (date: Date) => date.toLocaleDateString('en-GB')
export const DeliusTimeFormatter = (time: Date) =>
    `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
export const EuropeLondonFormat = (date: Date) =>
    date.toLocaleString('sv', { timeZone: 'Europe/London' }).replace(' ', 'T')

//Getting dates using date-fns lib
export const NextMonth = addMonths(new Date(), 1)
export const LastMonth = subMonths(new Date(), 1)
export const NextYear = addYears(new Date(), 1)
export const Tomorrow = addDays(new Date(), 1)
export const Yesterday = subDays(new Date(), 1)
