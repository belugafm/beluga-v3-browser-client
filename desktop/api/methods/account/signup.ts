import { Response, post } from "../../classes"

type Arguments = {
    name: string
    password: string
    confirmed_password: string
    fingerprint?: string
}

export function signup(body: Arguments): Promise<Response> {
    return post("account/signup", body)
}
