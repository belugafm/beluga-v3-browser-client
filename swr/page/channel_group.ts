import * as api from "../../api"

import { ChannelGroupObjectT, ChannelObjectT, MessageObjectT } from "../../api/object"

import useSWR from "swr"

type ReturnT = {
    channelGroup: ChannelGroupObjectT | null
    channelGroups: ChannelGroupObjectT[] | null
    channels: ChannelObjectT[] | null
    messages: MessageObjectT[] | null
    errors: any[]
    isLoading: boolean
}

type InputT = {
    id?: number
    uniqueName?: string
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

export const swrFetchData = (params: InputT): ReturnT => {
    const key = getSWRKey(params)
    const { data: res1, error: error1 } = useSWR(key, () => {
        return api.channelGroup.show(params)
    })
    const { data: res2, error: error2 } = useSWR(
        () => `${key}:${res1.channel_group.id}:channel_groups`,
        () => {
            return api.channelGroup.listChannelGroupss({ id: res1.channel_group.id })
        }
    )
    const { data: res3, error: error3 } = useSWR(
        () => `${key}:${res1.channel_group.id}:channels`,
        () => {
            return api.channelGroup.listChannels({ id: res1.channel_group.id })
        }
    )
    const { data: res4, error: error4 } = useSWR(
        () => `${key}:${res1.channel_group.id}:messages`,
        () => {
            return api.timeline.channelGroup({
                channelGroupId: res1.channel_group.id,
            })
        }
    )
    return {
        channelGroup: res1 ? res1.channel_group : null,
        channelGroups: res2 ? res2.channel_groups : null,
        channels: res3 ? res3.channels : null,
        messages: res4 ? res4.messages : null,
        errors: [error1, error2, error3],
        isLoading: res1 == null || res2 == null || res3 == null || res4 == null,
    }
}
