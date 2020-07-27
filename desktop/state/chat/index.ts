import { useState, createContext } from "react"
import * as reducer_methods from "./reducer_methods"
import { ReducersT } from "./state/reducer"
import { Response } from "../../api"
import { useLoggedInUser } from "../session"
import { ChatState } from "./state"
import { ReducerMethodT } from "./state/reducer"
import { websocket } from "./websocket"
import { ChannelObjectT, StatusObjectT } from "../../api/object"

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
        reducer: state.reducer,
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
        open: (channel: ChannelObjectT, insertColumnIndex?: number) => void
    }
    thread: {
        open: (status: StatusObjectT, insertColumnIndex?: number) => void
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

export const useChatActions = ({ reducer, orderedReducers }: ReducersT): ChatActionsT => {
    function reduce<T>(method: ReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducer(method, query)
    }

    return {
        column: {
            close: (columnIndex: number) => {},
        },
        channel: {
            open: (channel: ChannelObjectT, insertColumnIndex?: number) => {
                reduce(reducer_methods.columns.channel.create, {
                    channelId: channel.id,
                    columnIndex: insertColumnIndex,
                })
            },
        },
        thread: {
            open: (status: StatusObjectT, insertColumnIndex?: number) => {
                reduce(reducer_methods.columns.thread.create, {
                    statusId: status.id,
                    columnIndex: insertColumnIndex,
                })
            },
        },
    }
}
