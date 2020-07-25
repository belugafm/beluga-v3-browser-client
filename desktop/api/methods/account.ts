import { Response, post } from "../classes"

function signin(body: { name: string; password: string }): Promise<Response> {
    return post("account/signin", body)
}

function signup(body: {
    name: string
    password: string
    confirmedPassword: string
    fingerprint?: string
}): Promise<Response> {
    return post("account/signup", {
        name: body.name,
        password: body.password,
        confirmed_password: body.confirmedPassword,
        fingerprint: body.fingerprint,
    })
}

export const account = {
    signup,
    signin,
}
