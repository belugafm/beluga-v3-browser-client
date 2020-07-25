import { useState, createContext } from "react"
import * as reducer_methods from "./reducer_methods"
import { StoreT, ReducersT } from "./reducer"
import { Response } from "../../api"
import { useLoggedInUser } from "../session"
import { ChatState } from "./state"
import { websocket } from "./websocket"
import { ChannelObjectT } from "../../api/object"

type ReducerMethodT = (
    store: StoreT,
    query: Record<string, any>
) => Promise<[StoreT, Response | null]>

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
        reducer: (method: ReducerMethodT, query: Record<string, any>) =>
            state.reducer(method, query),
        orderedReducers: (
            reducers: {
                method: ReducerMethodT
                query: Record<string, any>
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
}

export const ChatActions = createContext({
    column: {
        close: null,
    },
    channel: {
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
    }
}
