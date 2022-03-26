import * as api from "../../api"

import { ChannelGroupObjectT } from "../../api/object"
import useSWR from "swr"

type ReturnT = {
    channelGroups: ChannelGroupObjectT[]
    error: any
    isLoading: boolean
}

export const swrListChannelsGroupsForChannelGroup = (id: number): ReturnT => {
    const { data, error } = useSWR(`channel_groups/list_channel_groups/${id}`, () => {
        return api.channelGroup.listChannelGroupss(id)
    })
    return {
        channelGroups: data ? data.channel_groups : [],
        error: error,
        isLoading: data == null && error == null,
    }
}
