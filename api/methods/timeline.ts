import { Response, UnexpectedResponseError, get } from "../fetch"
import { ChannelGroupId, ChannelId, MessageId } from "../object"

function removeUndefined(query: any) {
    const ret = {}
    Object.keys(query)
        .filter((key) => query[key] != null)
        .forEach((key) => {
            ret[key] = query[key]
        })
    return ret
}

export const timeline = {
    channelGroup: async (query: {
        channelGroupId: ChannelGroupId
        sinceId?: MessageId
        maxId?: MessageId
        sinceDate?: number
        untilDate?: number
        limit?: number
    }): Promise<Response> => {
        const responce = await get(
            "timeline/channel_group",
            removeUndefined({
                channel_group_id: query.channelGroupId,
                since_id: query.sinceId,
                max_id: query.maxId,
                since_date: query.sinceDate,
                until_date: query.untilDate,
                limit: query.limit,
            })
        )
        if (responce.messages == null) {
            throw new UnexpectedResponseError()
        }
        return responce
    },
    channel: async (query: {
        channelId: ChannelId
        sinceId?: MessageId
        maxId?: MessageId
        sinceDate?: number
        untilDate?: number
        limit?: number
    }): Promise<Response> => {
        const responce = await get(
            "timeline/channel",
            removeUndefined({
                channel_id: query.channelId,
                since_id: query.sinceId,
                max_id: query.maxId,
                since_date: query.sinceDate,
                until_date: query.untilDate,
                limit: query.limit,
            })
        )
        if (responce.messages == null) {
            throw new UnexpectedResponseError()
        }
        return responce
    },
    thread: async (query: {
        messageId: MessageId
        sinceId?: MessageId
        maxId?: MessageId
        sinceDate?: number
        untilDate?: number
        limit?: number
    }): Promise<Response> => {
        const responce = await get(
            "timeline/thread",
            removeUndefined({
                message_id: query.messageId,
                since_id: query.sinceId,
                max_id: query.maxId,
                since_date: query.sinceDate,
                until_date: query.untilDate,
                limit: query.limit,
            })
        )
        if (responce.messages == null) {
            throw new UnexpectedResponseError()
        }
        return responce
    },
}
