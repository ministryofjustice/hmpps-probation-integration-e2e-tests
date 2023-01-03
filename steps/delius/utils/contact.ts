import { Allocation, Contact } from '../../../test-data/test-data.js'

export function contact(relatesTo: string, type: string, allocation?: Allocation, instance = 0): Contact {
    return {
        relatesTo,
        type,
        instance,
        allocation: allocation,
    }
}
