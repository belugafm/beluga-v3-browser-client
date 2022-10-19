import * as api from "../../api"

import { ChannelObjectT } from "../../api/object"
import useSWR from "swr"

type ReturnT = {
    channels: ChannelObjectT[]
    error: any
    isLoading: boolean
}

export const swrListChannelsForChannelGroup = (id: number): ReturnT => {
    const { data, error } = useSWR(`channel_groups/list_channels/${id}`, () => {
        return api.channelGroup.listChannels({ id })
    })
    return {
        channels: data ? data.channels : null,
        error: error,
        isLoading: data == null && error == null,
    }
}
