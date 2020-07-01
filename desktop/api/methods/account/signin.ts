import { Response, post } from "../../classes"

type Arguments = {
    name: string
    password: string
}

export function signin(body: Arguments): Promise<Response> {
    return post("account/signin", body)
}
