import * as api from "../../api"

import { ChannelGroupObjectT } from "../../api/object"
import useSWR from "swr"

type ReturnT = {
    channelGroup: ChannelGroupObjectT | null
    error: any
    isLoading: boolean
}

type InputT = {
    id?: number
    uniqueName?: string
}

const getSWRKey = ({ id, uniqueName }: InputT) => {
    if (id) {
        return `channel_groups/show/id:${id}`
    }
    if (uniqueName) {
        return `channel_groups/show/unique_name:${uniqueName}`
    }
    throw new Error()
}

export const swrShowChannelGroup = (params: InputT): ReturnT => {
    const key = getSWRKey(params)
    const { data, error } = useSWR(key, () => {
        return api.channelGroup.show(params)
    })
    return {
        channelGroup: data ? data.channel_group : null,
        error: error,
        isLoading: data == null && error == null,
    }
}
