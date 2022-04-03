import { Dispatch, SetStateAction, createContext, useState } from "react"

export const ColumnTypes = {
    ChannelGroup: "ChannelGroup",
    Channel: "Channel",
    Thread: "Thread",
} as const

export type ColumnStateT = {
    id: number
    type: keyof typeof ColumnTypes
    postbox: {
        enabled: boolean
        query: any
    }
    context: {
        channelGroupId?: number
        channelId?: number
        messageId?: number
    }
    options: {
        showMutedStatuses: boolean
    }
    timeline: {
        messageIds: number[]
        query: {
            channelGroupId?: number
            channelId?: number
            messageId?: number
            maxId?: number
            sinceId?: number
            maxDate?: number
            untilDate?: number
            limit?: number
            includeComments?: boolean
        }
    }
}

const context: {
    columns: ColumnStateT[]
} = {
    columns: [],
}

export const ChatAppStateContext = createContext(context)

export type AppStateT = {
    columns: ColumnStateT[]
}

export type AppStateSetActionT = {
    setColumns: Dispatch<SetStateAction<ColumnStateT[]>>
}

export const useChatAppState = (): [AppStateT, AppStateSetActionT] => {
    console.info("useChatAppState")
    const [columns, setColumns] = useState<ColumnStateT[]>([])
    return [{ columns }, { setColumns }]
}
