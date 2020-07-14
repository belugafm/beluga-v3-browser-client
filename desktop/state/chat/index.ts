import { useChatAppState, ChatAppStateContext } from "./app"
import { useChatDomainData, ChatDomainDataContext } from "./data"
import { useState, useContext } from "react"
import * as reducers from "./reducers"
import { StoreT, udpateStore, StoreSetActionsT, ChatReducerContext, ReducersT } from "./reducer"
import { Response } from "../../api"

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
    const [domainData, domainDataSetActions] = useChatDomainData()
    const [appState, appStateSetActions] = useChatAppState()
    const [needsInitialize, setNeedsInitialize] = useState(true)

    const storeSetActions: StoreSetActionsT = {
        domainData: domainDataSetActions,
        appState: appStateSetActions,
    }

    const reducer = async (
        prevStore: StoreT,
        method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>,
        query: Record<string, any>
    ): Promise<Response | null> => {
        const [nextStore, response] = await method(prevStore, query)
        udpateStore(storeSetActions, prevStore, nextStore)
        return response
    }

    const orderedReducers = async (
        store: StoreT,
        reducers: {
            method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response]>
            query: Record<string, any>
        }[]
    ): Promise<void> => {
        const prevStore = store
        for (let index = 0; index < reducers.length; index++) {
            const { method, query } = reducers[index]
            const [nextStore, response] = await method(store, query)
            store = nextStore
        }
        udpateStore(storeSetActions, prevStore, store)
    }

    if (needsInitialize) {
        const store = { domainData, appState }
        if (context.channelId) {
            orderedReducers(store, [
                {
                    method: reducers.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 0,
                    },
                },
                {
                    method: reducers.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 1,
                    },
                },
                {
                    method: reducers.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 2,
                    },
                },
            ])
        }
        setNeedsInitialize(false)
    }

    return { domainData, appState, reducer, orderedReducers }
}
