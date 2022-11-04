import { Response, post } from "../fetch"

export function authorize(query: {
    consumer_key: string
    consumer_secret: string
    request_token: string
    request_token_secret: string
}): Promise<Response> {
    return post("oauth/authorize", query)
}

export function accessToken(
    query: {
        request_token: string
        verifier: string
    },
    oAuthParams: {
        consumer_key: string
        consumer_secret: string
        access_token: string
        access_token_secret: string
    }
): Promise<Response> {
    return post("oauth/access_token", query, oAuthParams)
}

export function requestToken(oAuthParams: {
    consumer_key: string
    consumer_secret: string
}): Promise<Response> {
    return post("oauth/request_token", {}, oAuthParams)
}

export const oauth = {
    authorize,
    accessToken,
    requestToken,
}
