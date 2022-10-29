import { Response, post } from "../../fetch"

export function requestToken(): Promise<Response> {
    return post("auth/twitter/request_token", {})
}

export function authenticate(query: {
    oauth_token: string
    oauth_verifier: string
}): Promise<Response> {
    return post("auth/twitter/authenticate", {
        oauth_token: query.oauth_token,
        oauth_verifier: query.oauth_verifier,
    })
}

export const twitter = { requestToken, authenticate }
