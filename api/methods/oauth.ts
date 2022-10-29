import { Response, post } from "../fetch"

export function authorize(query: {
    consumer_key: string
    consumer_secret: string
    request_token: string
    request_token_secret: string
}): Promise<Response> {
    return post("oauth/authorize", query)
}

export function accessToken(query: {
    consumer_key: string
    consumer_secret: string
    request_token: string
    request_token_secret: string
    verifier: string
}): Promise<Response> {
    return post("oauth/access_token", query)
}

export function requestToken(query: {
    consumer_key: string
    consumer_secret: string
}): Promise<Response> {
    return post("oauth/request_token", query)
}

export const oauth = {
    authorize,
    accessToken,
    requestToken,
}
