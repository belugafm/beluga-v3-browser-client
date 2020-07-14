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

let _currentStore: StoreT = null

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
    _currentStore = { domainData, appState }
    const reducer = async (
        method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>,
        query: Record<string, any>
    ): Promise<Response | null> => {
        try {
            const [nextStore, response] = await method(_currentStore, query)
            _currentStore = udpateStore(storeSetActions, _currentStore, nextStore)
            return response
        } catch (error) {
            console.error(error)
            alert(error)
        }
        return null
    }

    const orderedReducers = async (
        reducers: {
            method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response]>
            query: Record<string, any>
        }[]
    ): Promise<void> => {
        const prevStore = _currentStore
        for (let index = 0; index < reducers.length; index++) {
            const { method, query } = reducers[index]
            const [nextStore, response] = await method(_currentStore, query)
            _currentStore = nextStore
        }
        udpateStore(storeSetActions, prevStore, _currentStore)
    }

    if (needsInitialize) {
        if (context.channelId) {
            orderedReducers([
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
