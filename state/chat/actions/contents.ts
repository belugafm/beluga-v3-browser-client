import * as reducerMethod from "../store/reducer_method"

import { AppStateT, ContentStateT, ContentType } from "../store/types/app_state"
import { AsyncReducerMethodT, ReducersT } from "../store/types/reducer"
import { Context, createContext } from "react"

import { ChannelObjectT, MessageId, MessageObjectT } from "../../../api/object"
import { Response } from "../../../api"

export type ContentActionT = {
    closeContent: (content: ContentStateT) => void
    appendLatestMessages: (content: ContentStateT) => Promise<Response>
    prependMessagesWithMaxId: (content: ContentStateT, maxId: MessageId) => Promise<Response>
    appendMessagesWithSinceId: (content: ContentStateT, sinceId: MessageId) => Promise<Response>
    showContextMessages: (content: ContentStateT, messageId: MessageId) => Promise<Response>
    showLatestMessages: (content: ContentStateT) => Promise<Response>
    openChannel: (channel: ChannelObjectT, insertColumnAfter?: number) => Promise<Response | null>
    openThread: (message: MessageObjectT, insertColumnAfter?: number) => Promise<Response | null>
}

export const ContentActionContext: Context<ContentActionT> = createContext({
    closeContent: null,
    appendLatestMessages: null,
    prependMessagesWithMaxId: null,
    appendMessagesWithSinceId: null,
    showContextMessages: null,
    showLatestMessages: null,
    openChannel: null,
    openThread: null,
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

        appendLatestMessages: (content: ContentStateT) => {
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
                return reducers.asyncReducer(
                    reducerMethod.appState.thread.loadLatestMessages,
                    content
                )
                return
            }
        },
        prependMessagesWithMaxId: (content: ContentStateT, maxId: MessageId) => {
            if (content.type == ContentType.Channel) {
                return reducers.asyncReducer(
                    reducerMethod.appState.channel.prependMessagesWithMaxId,
                    {
                        prevContent: content,
                        maxId: maxId,
                    }
                )
            }
            if (content.type == ContentType.ChannelGroup) {
                // TODO
                return
            }
            if (content.type == ContentType.Thread) {
                return reducers.asyncReducer(
                    reducerMethod.appState.thread.prependMessagesWithMaxId,
                    {
                        prevContent: content,
                        maxId: maxId,
                    }
                )
                return
            }
        },
        appendMessagesWithSinceId: (content: ContentStateT, sinceId: MessageId) => {
            if (content.type == ContentType.Channel) {
                return reducers.asyncReducer(
                    reducerMethod.appState.channel.appendMessagesWithSinceId,
                    {
                        prevContent: content,
                        sinceId: sinceId,
                    }
                )
            }
            if (content.type == ContentType.ChannelGroup) {
                // TODO
                return
            }
            if (content.type == ContentType.Thread) {
                return reducers.asyncReducer(
                    reducerMethod.appState.thread.appendMessagesWithSinceId,
                    {
                        prevContent: content,
                        sinceId: sinceId,
                    }
                )
                return
            }
        },
        showContextMessages: (content: ContentStateT, messageId: MessageId) => {
            if (content.type == ContentType.Channel) {
                return reducers.asyncReducer(reducerMethod.appState.channel.showContextMessages, {
                    prevContent: content,
                    messageId: messageId,
                })
            }
            if (content.type == ContentType.ChannelGroup) {
                // TODO
                return
            }
            if (content.type == ContentType.Thread) {
                return reducers.asyncReducer(reducerMethod.appState.thread.showContextMessages, {
                    prevContent: content,
                    messageId: messageId,
                })
                return
            }
        },
        showLatestMessages: (content: ContentStateT) => {
            if (content.type == ContentType.Channel) {
                return reducers.asyncReducer(
                    reducerMethod.appState.channel.showLatestMessages,
                    content
                )
            }
            if (content.type == ContentType.ChannelGroup) {
                // TODO
                return
            }
            if (content.type == ContentType.Thread) {
                return reducers.asyncReducer(
                    reducerMethod.appState.thread.showLatestMessages,
                    content
                )
                return
            }
        },
        openChannel: (channel: ChannelObjectT, insertColumnAfter?: number) => {
            return reduce(reducerMethod.appState.channel.asyncAdd, {
                channelId: channel.id,
                insertColumnAfter: insertColumnAfter,
            })
        },
        openThread: (message: MessageObjectT, insertColumnAfter?: number) => {
            return reduce(reducerMethod.appState.thread.asyncAdd, {
                messageId: message.id,
                insertColumnAfter: insertColumnAfter,
            })
        },
    }
}
