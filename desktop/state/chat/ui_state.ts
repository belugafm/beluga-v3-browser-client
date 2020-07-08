import { CommunityObject, ChannelObject, StatusObject } from "../../api/object"
import { useState } from "react"

export const TimelineTypes = {
    Global: "Global",
    Community: "Community",
    Channel: "Channel",
    Thread: "Thread",
} as const

export type TimelineState = {
    type: keyof typeof TimelineTypes
    postbox: {
        enabled: boolean
        query: any
    }
    community?: CommunityObject
    channel?: ChannelObject
    status?: StatusObject
    statuses: StatusObject[]
}

export const useChatUIState = () => {
    const [timelines, setTimelines] = useState<TimelineState[]>([])
}
