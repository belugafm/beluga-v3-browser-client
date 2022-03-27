import * as api from "../../../api"

import { ChannelGroupObjectT, ChannelObjectT } from "../../../api/object"

import useSWR from "swr"

type ReturnT = {
    channel: ChannelObjectT | null
    channelGroups: ChannelGroupObjectT[] | null
    channels: ChannelObjectT[] | null
    errors: any[]
    isLoading: boolean
}

type InputT = {
    id?: number
    uniqueName?: string
}

const getSWRKey = ({ id, uniqueName }: InputT) => {
    if (id) {
        return `channel/list_all/id:${id}`
    }
    if (uniqueName) {
        return `channel/list_all/unique_name:${uniqueName}`
    }
    throw new Error()
}

export const swrListAllForChannel = (params: InputT): ReturnT => {
    const key = getSWRKey(params)
    const { data: res1, error: error1 } = useSWR(key, () => {
        return api.channel.show(params)
    })
    const { data: res2, error: error2 } = useSWR(
        () => `${key}:${res1.channel.id}:channel_groups`,
        () => {
            return api.channelGroup.listChannelGroupss(res1.channel.parent_channel_group_id)
        }
    )
    const { data: res3, error: error3 } = useSWR(
        () => `${key}:${res1.channel.id}:channels`,
        () => {
            return api.channelGroup.listChannels(res1.channel.parent_channel_group_id)
        }
    )
    return {
        channel: res1 ? res1.channel : null,
        channelGroups: res2 ? res2.channel_groups : null,
        channels: res3 ? res3.channels : null,
        errors: [error1, error2, error3],
        isLoading: res1 == null || res2 == null || res3 == null,
    }
}
