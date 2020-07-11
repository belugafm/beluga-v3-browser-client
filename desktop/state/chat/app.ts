import { useState, createContext, Dispatch, SetStateAction } from "react"

export const ColumnTypes = {
    Global: "Global",
    Community: "Community",
    Channel: "Channel",
    Thread: "Thread",
} as const

export type ColumnStateT = {
    index: number
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
        }
    }
}

const context: {
    columns: ColumnStateT[]
} = {
    columns: [],
}

export const ChatAppStateContext = createContext(context)

export type AppStateDataT = {
    columns: ColumnStateT[]
}

export type AppStateContextT = AppStateDataT & {
    setColumns: Dispatch<SetStateAction<ColumnStateT[]>>
}

export const useChatAppState = (): AppStateContextT => {
    console.info("useChatAppState")
    const [columns, setColumns] = useState<ColumnStateT[]>([])
    return {
        columns,
        setColumns,
    }
}
