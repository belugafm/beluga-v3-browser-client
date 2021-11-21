import { Response, post } from "../../classes"

export function requestToken(): Promise<Response> {
    return post("auth/twitter/request_token", {})
}

export function authenticate(body: {
    oauth_token: string
    oauth_verifier: string
}): Promise<Response> {
    return post("auth/twitter/authenticate", {
        oauth_token: body.oauth_token,
        oauth_verifier: body.oauth_verifier,
    })
}

export const twitter = { requestToken, authenticate }
