import * as reducerMethod from "../store/reducer_method"

import { AppStateT, ContentStateT, ContentType } from "../store/types/app_state"
import { AsyncReducerMethodT, ReducersT } from "../store/types/reducer"
import { Context, createContext } from "react"

import { ChannelObjectT } from "../../../api/object"
import { Response } from "../../../api"

export type ContentActionT = {
    closeContent: (content: ContentStateT) => void
    loadLatestMessages: (content: ContentStateT) => void
    loadMessagesWithMaxId: (content: ContentStateT, maxId: number) => void
    loadMessagesWithSinceId: (content: ContentStateT, sinceId: number) => void
    openChannel: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
}

export const ContentActionContext: Context<ContentActionT> = createContext({
    closeContent: null,
    loadLatestMessages: null,
    openChannel: null,
})

export const useContentAction = ({
    appState,
    reducers,
}: {
    appState: AppStateT
    reducers: ReducersT
}): ContentActionT => {
    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducers.asyncReducer(method, query)
    }
    return {
        closeContent: (content: ContentStateT) => {
            return reduce(reducerMethod.appState.content.close, content)
        },
        loadLatestMessages: (content: ContentStateT) => {
            if (content.type == ContentType.Channel) {
                return reducers.asyncReducer(
                    reducerMethod.appState.channel.loadLatestMessages,
                    content
                )
            }
            if (content.type == ContentType.ChannelGroup) {
                // TODO
                return
            }
            if (content.type == ContentType.Thread) {
                // TODO
                return
            }
        },
        openChannel: (channel: ChannelObjectT, insertColumnAfter?: number) => {
            return reduce(reducerMethod.appState.channel.asyncAdd, {
                channelId: channel.id,
                insertColumnAfter: insertColumnAfter,
            })
        },
    }
}
