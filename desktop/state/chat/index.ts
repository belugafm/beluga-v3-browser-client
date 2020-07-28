import { useState, createContext } from "react"
import * as reducer_methods from "./reducer_methods"
import { ReducersT } from "./state/reducer"
import { Response } from "../../api"
import { useLoggedInUser } from "../session"
import { ChatState } from "./state"
import { ReducerMethodT } from "./state/reducer"
import { websocket } from "./websocket"
import { ChannelObjectT, StatusObjectT } from "../../api/object"
import { AppStateT } from "./state/app"

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
                        insertColumnAfter: 0,
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

export type ChatActionsT = {
    column: {
        close: (columnIndex: number) => void
    }
    channel: {
        open: (channel: ChannelObjectT, insertColumnAfter?: number) => void
    }
    thread: {
        open: (status: StatusObjectT, insertColumnAfter?: number) => void
    }
}

export const ChatActions = createContext({
    column: {
        close: null,
    },
    channel: {
        open: null,
    },
    thread: {
        open: null,
    },
})

export const useChatActions = ({
    appState,
    reducers,
}: {
    appState: AppStateT
    reducers: ReducersT
}): ChatActionsT => {
    function reduce<T>(method: ReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducers.reducer(method, query)
    }

    return {
        column: {
            close: (columnIndex: number) => {},
        },
        channel: {
            open: (channel: ChannelObjectT, insertColumnAfter?: number) => {
                reduce(reducer_methods.columns.channel.create, {
                    channelId: channel.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
        thread: {
            open: (status: StatusObjectT, insertColumnAfter?: number) => {
                reduce(reducer_methods.columns.thread.create, {
                    statusId: status.id,
                    insertColumnAfter: insertColumnAfter,
                })
            },
        },
    }
}
