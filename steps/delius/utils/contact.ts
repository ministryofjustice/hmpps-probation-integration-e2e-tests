import {Practitioner} from "./person";

export interface Contact{relatesTo: string, type: string, officer: Practitioner, instance?: number }

export function contact(relatesTo:string, type:string, officer?:Practitioner, instance:number = 0):Contact {
    return {
        relatesTo,
        type,
        officer,
        instance
    }
}

