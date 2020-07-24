import { ChatAppStateContext } from "./state/app"
import { ChatDomainDataContext } from "./state/data"
import { useState, useContext } from "react"
import * as reducer_methods from "./reducer_methods"
import { StoreT, ChatReducerContext, ReducersT } from "./reducer"
import { Response } from "../../api"
import { useLoggedInUser } from "../session"
import { ChatState } from "./state"
import { websocket } from "./websocket"

export const useChatStoreContext = (): [StoreT, ReducersT] => {
    const domainData = useContext(ChatDomainDataContext)
    const appState = useContext(ChatAppStateContext)
    const reducers = useContext(ChatReducerContext)
    return [
        {
            domainData,
            appState,
        },
        reducers,
    ]
}

type ReducerMethodT = (
    store: StoreT,
    query: Record<string, any>
) => Promise<[StoreT, Response | null]>

type WebsocketMessage = {
    operation: string
    model: string
    document_id: any
    status?: {
        user_id: string
        channel_id: string
        community_id: string
    }
}

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

    websocket.use(loggedInUser, {
        reducer: state.reduce,
        orderedReducers: state.orderedReducers,
    })

    if (needsInitialize) {
        if (context.channelId) {
            state.orderedReducers([
                {
                    method: reducer_methods.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 0,
                    },
                },
            ])
        }
        setNeedsInitialize(false)
    }

    return {
        domainData: store.domainData,
        appState: store.appState,
        reducer: (method: ReducerMethodT, query: Record<string, any>) =>
            state.reduce(method, query),
        orderedReducers: (
            reducers: {
                method: ReducerMethodT
                query: Record<string, any>
            }[]
        ) => state.orderedReducers(reducers),
    }
}
