import { useState } from "react"
import * as reducer_methods from "./reducer_methods"
import { useLoggedInUser } from "../session"
import { ChatState } from "./state"
import { ReducerMethodT } from "./state/reducer"
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
    const { loggedInUser } = useLoggedInUser()

    websocket.use({
        loggedInUser,
        reducers: {
            reducer: state.reducer,
            orderedReducers: state.orderedReducers,
        },
        appState: store.appState,
    })

    if (needsInitialize) {
        if (context.channelId) {
            state.orderedReducers([
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
        reducer: <T>(method: ReducerMethodT<T>, query: T) => state.reducer(method, query),
        orderedReducers: <T>(
            reducers: {
                method: ReducerMethodT<T>
                query: T
            }[]
        ) => state.orderedReducers(reducers),
    }
}
