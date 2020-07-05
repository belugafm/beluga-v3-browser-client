import { Response, post } from "../../classes"

type Arguments = {
    name: string
    description: string
    is_public: boolean
    community_id?: string
}

export function create(body: Arguments): Promise<Response> {
    return post("channels/create", body)
}
