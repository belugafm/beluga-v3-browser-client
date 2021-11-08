import { Response, post } from "../classes"

function signin(body: { name: string; password: string }): Promise<Response> {
    return post("account/signin", body)
}

function signup(body: {
    name: string
    password: string
    confirmationPassword: string
}): Promise<Response> {
    return post("account/signup", {
        name: body.name,
        password: body.password,
        confirmation_password: body.confirmationPassword,
    })
}

export const account = {
    signup,
    signin,
}
