import { Response, post } from "../classes"

function signin(body: { name: string; password: string }): Promise<Response> {
    return post("account/signin", body)
}

function signup(body: {
    name: string
    password: string
    confirmed_password: string
    fingerprint?: string
}): Promise<Response> {
    return post("account/signup", body)
}

export const account = {
    signup,
    signin,
}
