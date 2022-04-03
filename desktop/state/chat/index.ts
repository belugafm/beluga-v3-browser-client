import * as reducerMethods from "./reducer_method"

import { ChannelGroupObjectT, ChannelObjectT, MessageObjectT } from "../../api/object"

import { AsyncReducerMethodT } from "./store/reducer"
import { ChatState } from "./store"
import { swrShowLoggedInUser } from "../../swr/session"
import { websocket } from "./websocket"

const state = new ChatState()

export type Context = {
    channel?: {
        object: ChannelObjectT
        messages: MessageObjectT[]
    }
    channelGroup?: {
        object: ChannelGroupObjectT
        messages: MessageObjectT[]
    }
    thread?: {
        object: MessageObjectT
        messages: MessageObjectT[]
    }
}

export const useChatStore = (context: Context) => {
    console.info("useChatState")
    let [store] = state.use()
    const { loggedInUser } = swrShowLoggedInUser()

    websocket.use({
        loggedInUser,
        reducers: {
            reducer: state.asyncReduce,
            orderedReducers: state.asyncOrderedReduce,
        },
        appState: store.appState,
    })

    if (context.channel) {
        store = reducerMethods.app.column.channel.add(store, {
            channel: context.channel.object,
            messages: context.channel.messages,
        })
    }

    return {
        domainData: store.domainData,
        appState: store.appState,
        reducer: <T>(method: AsyncReducerMethodT<T>, query: T) => state.asyncReduce(method, query),
        orderedReducers: <T>(
            reducers: {
                method: AsyncReducerMethodT<T>
                query: T
            }[]
        ) => state.asyncOrderedReduce(reducers),
    }
}
