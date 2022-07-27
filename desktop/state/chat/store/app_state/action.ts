import * as reducerMethod from "../../reducer_method"

import { AppStateT, ContentStateT } from "../types/app_state"
import { AsyncReducerMethodT, AsyncReducersT } from "../types/reducer"
import { Context, createContext } from "react"

import { ChannelObjectT } from "../../../../api/object"
import { Response } from "../../../../api"

export type ContentActionT = {
    content: {
        close: (content: ContentStateT) => void
        loadLatestMessagesIfNeeded: (content: ContentStateT) => void
    }
    channel: {
        open: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
}

export const ContentActionContext: Context<ContentActionT> = createContext({
    content: {
        close: null,
        loadLatestMessagesIfNeeded: null,
    },
    channel: {
        open: null,
    },
})

export const useContentAction = ({
    appState,
    reducers,
}: {
    appState: AppStateT
    reducers: AsyncReducersT
}): ContentActionT => {
    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducers.reducer(method, query)
    }

    return {
        content: {
            close: (content: ContentStateT) => {
                return reduce(reducerMethod.appState.content.close, content)
            },
            loadLatestMessagesIfNeeded: (content: ContentStateT) => {
                if (content.timeline.shouldFetch == false) {
                    return
                }
                if (content.context.channelGroupId) {
                } else if (content.context.channelId) {
                    return reducers.reducer(
                        reducerMethod.appState.channel.loadLatestMessages,
                        content
                    )
                }
            },
        },
        channel: {
            open: (channel: ChannelObjectT, insertColumnAfter?: number) => {
                return reduce(reducerMethod.appState.channel.asyncAdd, {
                    channelId: channel.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
    }
}
