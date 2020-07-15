import { Response, get, UnexpectedResponseError } from "../classes"

async function channel(query: {
    channel_id: string
    since_id?: string
    max_id?: string
    since_date?: string
    until_date?: string
}): Promise<Response> {
    const responce = await get("timeline/channel", query)
    if (responce.statuses == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const timeline = {
    channel,
}
