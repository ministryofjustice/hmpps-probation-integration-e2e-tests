import { type Practitioner } from './person.js'

export interface Contact {
    relatesTo: string
    type: string
    officer: Practitioner
    instance?: number
}

export function contact(relatesTo: string, type: string, officer?: Practitioner, instance = 0): Contact {
    return {
        relatesTo,
        type,
        officer,
        instance,
    }
}
