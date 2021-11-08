import * as reducer_methods from "./reducer_methods"

import { AppStateT, ColumnStateT, ColumnTypes } from "./state/app"
import { AsyncReducerMethodT, AsyncReducersT } from "./state/reducer"
import { ChannelObjectT, StatusObjectT } from "../../api/object"
import { Context, createContext } from "react"

import { Response } from "../../api"

export type ChatActionsT = {
    column: {
        close: (column: ColumnStateT) => void
        setTimelineQuery: (
            column: ColumnStateT,
            query: Record<string, any>
        ) => Promise<Response | null>
        setOptions: (column: ColumnStateT, options: Record<string, any>) => Promise<Response | null>
    }
    channel: {
        open: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
    thread: {
        open: (status: StatusObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
}

export const ChatActions: Context<ChatActionsT> = createContext({
    column: {
        close: null,
        setTimelineQuery: null,
        setOptions: null,
    },
    channel: {
        open: null,
    },
    thread: {
        open: null,
    },
})

export const useChatActions = ({
    appState,
    reducers,
}: {
    appState: AppStateT
    reducers: AsyncReducersT
}): ChatActionsT => {
    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducers.reducer(method, query)
    }

    return {
        column: {
            close: (column: ColumnStateT) => {
                if (column.type === ColumnTypes.Channel) {
                    return reduce(reducer_methods.columns.channel.close, column)
                }
                if (column.type === ColumnTypes.Thread) {
                    return reduce(reducer_methods.columns.thread.close, column)
                }
            },
            setTimelineQuery: (column: ColumnStateT, query: Record<string, any>) => {
                if (column.type === ColumnTypes.Channel) {
                    return reduce(reducer_methods.columns.channel.setTimelineQuery, {
                        column,
                        query,
                    })
                }
                if (column.type === ColumnTypes.Thread) {
                    return reduce(reducer_methods.columns.thread.setTimelineQuery, {
                        column,
                        query,
                    })
                }
            },
            setOptions: (column: ColumnStateT, options: ColumnStateT["options"]) => {
                if (column.type === ColumnTypes.Channel) {
                    return reduce(reducer_methods.columns.channel.setOptions, {
                        column,
                        options,
                    })
                }
                if (column.type === ColumnTypes.Thread) {
                    return reduce(reducer_methods.columns.thread.setOptions, {
                        column,
                        options,
                    })
                }
            },
        },
        channel: {
            open: (channel: ChannelObjectT, insertColumnAfter?: number) => {
                return reduce(reducer_methods.columns.channel.create, {
                    channelId: channel.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
        thread: {
            open: (status: StatusObjectT, insertColumnAfter?: number) => {
                return reduce(reducer_methods.columns.thread.create, {
                    statusId: status.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
    }
}
