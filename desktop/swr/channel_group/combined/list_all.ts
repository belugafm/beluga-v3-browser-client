import * as api from "../../../api"

import { ChannelGroupObjectT, ChannelObjectT } from "../../../api/object"

import useSWR from "swr"

type ReturnT = {
    channelGroup: ChannelGroupObjectT | null
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
        return `channel_groups/list_all/id:${id}`
    }
    if (uniqueName) {
        return `channel_groups/list_all/unique_name:${uniqueName}`
    }
    throw new Error()
}

export const swrListAllForChannelGroup = (params: InputT): ReturnT => {
    const key = getSWRKey(params)
    const { data: res1, error: error1 } = useSWR(key, () => {
        return api.channelGroup.show(params)
    })
    const { data: res2, error: error2 } = useSWR(() => {
        return api.channelGroup.listChannelGroupss(res1.channel_group.id)
    })
    const { data: res3, error: error3 } = useSWR(() => {
        return api.channelGroup.listChannels(res1.channel_group.id)
    })
    return {
        channelGroup: res1 ? res1.channel_group : null,
        channelGroups: res2 ? res2.channel_groups : null,
        channels: res3 ? res3.channels : null,
        errors: [error1, error2, error3],
        isLoading:
            res1 == null &&
            res2 == null &&
            res3 == null &&
            error1 == null &&
            error2 == null &&
            error3 == null,
    }
}
