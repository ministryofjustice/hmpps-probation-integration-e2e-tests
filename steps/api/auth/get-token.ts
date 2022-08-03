import * as dotenv from "dotenv";
import {request} from "@playwright/test";

export const getToken = async () => {
    dotenv.config()
    const context = await request.newContext({
        baseURL: process.env.AUTH_URL,
    })
    const creds = Buffer.from(`${process.env.CRED_USERNAME}:${process.env.CRED_PASSWORD}`).toString('base64')
    const response = await context.post(`/auth/oauth/token?grant_type=client_credentials&username=${process.env.DPS_USERNAME}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${creds}`,
        }
    })
    const json = await response.json()
    return json.access_token
}