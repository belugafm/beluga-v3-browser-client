import * as reducerMethod from "../store/reducer_method"

import { AppStateT, ContentStateT, ContentType } from "../store/types/app_state"
import { AsyncReducerMethodT, ReducersT } from "../store/types/reducer"
import { Context, createContext } from "react"

import { ChannelObjectT } from "../../../api/object"
import { Response } from "../../../api"

export type ContentActionT = {
    closeContent: (content: ContentStateT) => void
    loadLatestMessagesIfNeeded: (content: ContentStateT) => void
    openChannel: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
}

export const ContentActionContext: Context<ContentActionT> = createContext({
    closeContent: null,
    loadLatestMessagesIfNeeded: null,
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
        loadLatestMessagesIfNeeded: (content: ContentStateT) => {
            // if (content.timeline.shouldFetch == false) {
            //     return
            // }
            if (content.type == ContentType.Channel) {
                return reducers.asyncReducer(
                    reducerMethod.appState.channel.loadLatestMessages,
                    content
                )
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
