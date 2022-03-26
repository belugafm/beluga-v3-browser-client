import * as reducer_methods from "./reducer_methods"

import { AsyncReducerMethodT } from "./state/reducer"
import { ChatState } from "./state"
import { swrShowLoggedInUser } from "../../swr/session"
import { useState } from "react"
import { websocket } from "./websocket"

const state = new ChatState()

export const useChatStore = ({
    context,
}: {
    context: {
        channelId?: string
        communityId?: string
        statusId?: string
        userId?: string
    }
}) => {
    console.info("useChatState")
    const [store] = state.use()
    const [needsInitialize, setNeedsInitialize] = useState(true)
    const { loggedInUser } = swrShowLoggedInUser()

    websocket.use({
        loggedInUser,
        reducers: {
            reducer: state.asyncReduce,
            orderedReducers: state.asyncOrderedReduce,
        },
        appState: store.appState,
    })

    if (needsInitialize) {
        if (context.channelId) {
            state.asyncOrderedReduce([
                {
                    method: reducer_methods.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                    },
                },
            ])
        }
        setNeedsInitialize(false)
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
