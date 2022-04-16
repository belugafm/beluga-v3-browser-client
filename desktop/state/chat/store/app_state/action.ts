import * as reducerMethod from "../../reducer_method"

import { AppStateT, ContentStateT, ContentType } from "../app_state"
import { AsyncReducerMethodT, AsyncReducersT } from "../types/reducer"
import { ChannelObjectT, MessageObjectT } from "../../../../api/object"
import { Context, createContext } from "react"

import { Response } from "../../../../api"

export type ActionT = {
    content: {
        close: (content: ContentStateT) => void
        setTimelineQuery: (
            content: ContentStateT,
            query: Record<string, any>
        ) => Promise<Response | null>
        setOptions: (
            content: ContentStateT,
            options: Record<string, any>
        ) => Promise<Response | null>
        loadLatestMessagesIfNeeded: (content: ContentStateT) => void
    }
    channel: {
        open: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
    thread: {
        open: (status: MessageObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
}

export const ContentActionContext: Context<ActionT> = createContext({
    content: {
        close: null,
        setTimelineQuery: null,
        setOptions: null,
        loadLatestMessagesIfNeeded: null,
    },
    channel: {
        open: null,
    },
    thread: {
        open: null,
    },
})

export const useContentAction = ({
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
        content: {
            close: (content: ContentStateT) => {
                if (content.type === ContentType.Channel) {
                    return reduce(reducerMethod.appState.content.channel.close, content)
                }
                if (content.type === ContentType.Thread) {
                    return reduce(reducerMethod.appState.content.thread.close, content)
                }
            },
            setTimelineQuery: (content: ContentStateT, query: Record<string, any>) => {
                if (content.type === ContentType.Channel) {
                    return reduce(reducerMethod.appState.content.channel.setTimelineQuery, {
                        content,
                        query,
                    })
                }
                if (content.type === ContentType.Thread) {
                    return reduce(reducerMethod.appState.content.thread.setTimelineQuery, {
                        content,
                        query,
                    })
                }
            },
            setOptions: (content: ContentStateT, options: ContentStateT["options"]) => {
                if (content.type === ContentType.Channel) {
                    return reduce(reducerMethod.appState.content.channel.setOptions, {
                        content,
                        options,
                    })
                }
                if (content.type === ContentType.Thread) {
                    return reduce(reducerMethod.appState.content.thread.setOptions, {
                        content,
                        options,
                    })
                }
            },
            loadLatestMessagesIfNeeded: (content: ContentStateT) => {
                if (content.timeline.isLoadingLatestMessagesEnabled == false) {
                    return
                }
                return reducers.reducer(
                    reducerMethod.appState.contentType.channel.loadLatestMessages,
                    content
                )
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
