import { CommunityObject, ChannelObject, StatusObject } from "../../api/object"
import { useState, createContext } from "react"
import * as WebAPI from "../../api"
import { update } from "../../api/methods/statuses/update"

export const ColumnType = {
    Global: "Global",
    Community: "Community",
    Channel: "Channel",
    Thread: "Thread",
} as const

export type ColumnState = {
    index: number
    type: keyof typeof ColumnType
    postbox: {
        enabled: boolean
        query: any
    }
    context: {
        community_id?: string
        channel_id?: string
        status_id?: string
    }
    timeline: {
        status_ids: string[]
    }
}

const context: {
    columns: ColumnState[]
    updateColumnTimeline: (column: ColumnState) => Promise<void>
} = {
    columns: [],
    updateColumnTimeline: null,
}

export const ChatAppStateContext = createContext(context)

export type AppState = {
    columns: ColumnState[]
    updateColumnTimeline: (column: ColumnState) => Promise<void>
}

export const useChatAppState = ({
    context,
}: {
    context: {
        channelId?: string
        communityId?: string
        statusId?: string
        userId?: string
    }
}) => {
    console.info("useChatAppState")
    const [columns, setColumns] = useState<ColumnState[]>([])
    return {
        columns,
        setColumns,
    }
}
