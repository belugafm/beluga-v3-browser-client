import { Response, get, UnexpectedResponseError } from "../../classes"

type Arguments = {
    channel_id: string
}

export async function show(query: Arguments): Promise<Response> {
    const responce = await get("channels/show", query)
    if (responce.channel == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}
