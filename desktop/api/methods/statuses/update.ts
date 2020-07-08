import { Response, post } from "../../classes"

type Arguments = {
    text: string
    channel_id: string
}

export function update(body: Arguments): Promise<Response> {
    return post("statuses/update", body)
}
