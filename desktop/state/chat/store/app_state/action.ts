import * as reducerMethod from "../../reducer_method"

import { AppStateT, ContentStateT } from "../types/app_state"
import { AsyncReducerMethodT, AsyncReducersT } from "../types/reducer"
import { Context, createContext } from "react"

import { ChannelObjectT } from "../../../../api/object"
import { Response } from "../../../../api"

export type ActionT = {
    content: {
        close: (content: ContentStateT) => void
        loadLatestMessagesIfNeeded: (content: ContentStateT) => void
    }
    channel: {
        open: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
    }
}

export const ContentActionContext: Context<ActionT> = createContext({
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
}): ActionT => {
    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducers.reducer(method, query)
    }

    return {
        content: {
            close: (content: ContentStateT) => {
                return reduce(reducerMethod.appState.content.close, content)
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
                return reduce(reducerMethod.appState.contentType.channel.asyncAdd, {
                    channelId: channel.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
    }
}
