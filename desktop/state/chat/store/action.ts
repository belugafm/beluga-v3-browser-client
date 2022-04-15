import * as reducerMethod from "../reducer_method"

import { AppStateT, ContentStateT, ContentType } from "./app_state"
import { AsyncReducerMethodT, AsyncReducersT } from "./reducer"
import { ChannelObjectT, MessageObjectT } from "../../../api/object"
import { Context, createContext } from "react"

import { Response } from "../../../api"

export type ActionT = {
    content: {
        close: (column: ContentStateT) => void
        setTimelineQuery: (
            column: ContentStateT,
            query: Record<string, any>
        ) => Promise<Response | null>
        setOptions: (
            column: ContentStateT,
            options: Record<string, any>
        ) => Promise<Response | null>
    }
    channel: {
        open: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
    thread: {
        open: (status: MessageObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
}

export const Action: Context<ActionT> = createContext({
    content: {
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

export const useAction = ({
    appState,
    reducers,
}: {
    appState: AppStateT
    reducers: AsyncReducersT
}): ActionT => {
    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducers.reducer(method, query)
    }

    return {
        column: {
            close: (column: ContentStateT) => {
                if (column.type === ContentType.Channel) {
                    return reduce(reducerMethod.appState.content.channel.close, column)
                }
                if (column.type === ContentType.Thread) {
                    return reduce(reducerMethod.appState.content.thread.close, column)
                }
            },
            setTimelineQuery: (column: ContentStateT, query: Record<string, any>) => {
                if (column.type === ContentType.Channel) {
                    return reduce(reducerMethod.appState.content.channel.setTimelineQuery, {
                        column,
                        query,
                    })
                }
                if (column.type === ContentType.Thread) {
                    return reduce(reducerMethod.appState.content.thread.setTimelineQuery, {
                        column,
                        query,
                    })
                }
            },
            setOptions: (column: ContentStateT, options: ContentStateT["options"]) => {
                if (column.type === ContentType.Channel) {
                    return reduce(reducerMethod.appState.content.channel.setOptions, {
                        column,
                        options,
                    })
                }
                if (column.type === ContentType.Thread) {
                    return reduce(reducerMethod.appState.content.thread.setOptions, {
                        column,
                        options,
                    })
                }
            },
        },
        channel: {
            open: (channel: ChannelObjectT, insertColumnAfter?: number) => {
                return reduce(reducerMethod.appState.content.channel.asyncAdd, {
                    channelId: channel.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
        thread: {
            open: (status: MessageObjectT, insertColumnAfter?: number) => {
                return reduce(reducerMethod.appState.content.thread.asyncAdd, {
                    messageId: status.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
    }
}
