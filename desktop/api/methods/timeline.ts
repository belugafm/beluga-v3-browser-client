import { Response, get, UnexpectedResponseError } from "../classes"

async function channel(query: {
    channelId: string
    sinceId?: string
    maxId?: string
    sinceDate?: string
    untilDate?: string
}): Promise<Response> {
    const responce = await get("timeline/channel", {
        channel_id: query.channelId,
        since_id: query.sinceId,
        max_id: query.maxId,
        since_date: query.sinceDate,
        until_date: query.untilDate,
    })
    if (responce.statuses == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const timeline = {
    channel,
}
