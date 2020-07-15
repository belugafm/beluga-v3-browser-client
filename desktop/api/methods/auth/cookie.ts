import { Response, post } from "../../classes"

export function authenticate(): Promise<Response> {
    return post("auth/cookie/authenticate", {})
}

export const cookie = { authenticate }
