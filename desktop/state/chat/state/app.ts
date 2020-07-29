import { useState, createContext, Dispatch, SetStateAction } from "react"

export const ColumnTypes = {
    Global: "Global",
    Community: "Community",
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
        communityId?: string
        channelId?: string
        statusId?: string
    }
    options: {
        showMutedStatuses: boolean
    }
    timeline: {
        statusIds: string[]
        query: {
            communityId?: string
            channelId?: string
            statusId?: string
            maxId?: string
            sinceId?: string
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
