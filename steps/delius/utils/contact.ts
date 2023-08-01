import { Allocation, Contact } from '../../../test-data/test-data'

export function contact(
    relatesTo: string,
    type: string,
    allocation?: Allocation,
    outcome?: string,
    attended?: string,
    complied?: string,
    instance = 0
): Contact {
    return {
        relatesTo,
        type,
        instance,
        allocation: allocation,
    }
}
