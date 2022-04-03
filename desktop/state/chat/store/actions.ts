import * as reducerMethods from "../reducer_method"

import { AppStateT, ColumnStateT, ColumnTypes } from "./app_state"
import { AsyncReducerMethodT, AsyncReducersT } from "./reducer"
import { ChannelObjectT, MessageObjectT } from "../../../api/object"
import { Context, createContext } from "react"

import { Response } from "../../../api"

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
        open: (status: MessageObjectT, insertColumnAfter?: number) => Promise<Response | null>
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
                    return reduce(reducerMethods.app.column.channel.close, column)
                }
                if (column.type === ColumnTypes.Thread) {
                    return reduce(reducerMethods.app.column.thread.close, column)
                }
            },
            setTimelineQuery: (column: ColumnStateT, query: Record<string, any>) => {
                if (column.type === ColumnTypes.Channel) {
                    return reduce(reducerMethods.app.column.channel.setTimelineQuery, {
                        column,
                        query,
                    })
                }
                if (column.type === ColumnTypes.Thread) {
                    return reduce(reducerMethods.app.column.thread.setTimelineQuery, {
                        column,
                        query,
                    })
                }
            },
            setOptions: (column: ColumnStateT, options: ColumnStateT["options"]) => {
                if (column.type === ColumnTypes.Channel) {
                    return reduce(reducerMethods.app.column.channel.setOptions, {
                        column,
                        options,
                    })
                }
                if (column.type === ColumnTypes.Thread) {
                    return reduce(reducerMethods.app.column.thread.setOptions, {
                        column,
                        options,
                    })
                }
            },
        },
        channel: {
            open: (channel: ChannelObjectT, insertColumnAfter?: number) => {
                return reduce(reducerMethods.app.column.channel.asyncAdd, {
                    channelId: channel.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
        thread: {
            open: (status: MessageObjectT, insertColumnAfter?: number) => {
                return reduce(reducerMethods.app.column.thread.asyncAdd, {
                    messageId: status.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
    }
}
