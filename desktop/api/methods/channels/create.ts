import { Response, post } from "../../classes"

type Arguments = {
    name: string
    community_id?: string
}

export function create(body: Arguments): Promise<Response> {
    return post("channel/create", body)
}
