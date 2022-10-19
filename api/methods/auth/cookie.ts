import { Response, post } from "../../fetch"

export function authenticate(): Promise<Response> {
    return post("auth/cookie/authenticate", {})
}

export const cookie = { authenticate }
