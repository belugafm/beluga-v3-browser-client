import * as api from "../../api"

import { ChannelGroupObjectT, ChannelObjectT, MessageObjectT } from "../../api/object"

import useSWR from "swr"

type ReturnT = {
    channels: ChannelObjectT[] | null
    messages: MessageObjectT[] | null
    channelGroup: ChannelGroupObjectT | null
    errors: any[]
    isLoading: boolean
}

const getSWRKey = ({ id, uniqueName }: InputT) => {
    if (id) {
        return `channel_groups/list_all/id:${id}`
    }
    if (uniqueName) {
        return `channel_groups/list_all/unique_name:${uniqueName}`
    }
    throw new Error()
}

export const swrFetchData = (): ReturnT => {
    const { data: res1, error: error1 } = useSWR("idnex:channels", () => {
        return api.channel.listChannels({
            sortBy: "message_count",
            sortOrder: "descending",
        })
    })
    const { data: res2, error: error2 } = useSWR("idnex:messages", () => {
        return api.timeline.channelGroup({
            channelGroupId: 1,
        })
    })
    const { data: res3, error: error3 } = useSWR("index:channel_group", () => {
        return api.channelGroup.show({ id: 1 })
    })
    return {
        channels: res1 ? res1.channels : null,
        messages: res2 ? res2.messages : null,
        channelGroup: res3 ? res3.channel_group : null,
        errors: [error1, error2, error3],
        isLoading: res1 == null || res2 == null || res3 == null,
    }
}
