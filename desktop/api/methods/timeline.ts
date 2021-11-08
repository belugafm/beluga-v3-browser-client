import { Response, UnexpectedResponseError, get } from "../classes"

function removeUndefined(query: any) {
    const ret = {}
    Object.keys(query)
        .filter((key) => query[key] != null)
        .forEach((key) => {
            ret[key] = query[key]
        })
    return ret
}

async function channel(query: {
    channelId: string
    sinceId?: string
    maxId?: string
    sinceDate?: number
    untilDate?: number
    includeComments?: boolean
    limit?: number
}): Promise<Response> {
    const responce = await get(
        "timeline/channel",
        removeUndefined({
            channel_id: query.channelId,
            since_id: query.sinceId,
            max_id: query.maxId,
            since_date: query.sinceDate,
            until_date: query.untilDate,
            include_comments: !!query.includeComments,
            limit: query.limit,
        })
    )
    if (responce.statuses == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function thread(query: {
    statusId: string
    sinceId?: string
    maxId?: string
    sinceDate?: number
    untilDate?: number
    limit?: number
}): Promise<Response> {
    const responce = await get(
        "timeline/thread",
        removeUndefined({
            status_id: query.statusId,
            since_id: query.sinceId,
            max_id: query.maxId,
            since_date: query.sinceDate,
            until_date: query.untilDate,
            limit: query.limit,
        })
    )
    if (responce.statuses == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const timeline = {
    channel,
    thread,
}
