import { Response, get, UnexpectedResponseError } from "../../classes"

type Arguments = {
    channel_id: string
    since_id?: string
    max_id?: string
    since_date?: string
    until_date?: string
}

export async function channel(query: Arguments): Promise<Response> {
    const responce = await get("timeline/channel", query)
    if (responce.statuses == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}
