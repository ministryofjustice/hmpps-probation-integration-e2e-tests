import { format } from 'date-fns'

export const splitDate = (date: Date) => {
    return format(date, 'dd MM yyyy').split(' ')
}
