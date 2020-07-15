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

type ReducerMethodT = (
    store: StoreT,
    query: Record<string, any>
) => Promise<[StoreT, Response | null]>

class State {
    currentStore: StoreT = null
    storeSetActions: StoreSetActionsT = null
    use(): [StoreT, StoreSetActionsT] {
        const [domainData, domainDataSetActions] = useChatDomainData()
        const [appState, appStateSetActions] = useChatAppState()
        const store: StoreT = { domainData, appState }
        const storeSetActions: StoreSetActionsT = {
            domainData: domainDataSetActions,
            appState: appStateSetActions,
        }
        this.currentStore = store
        this.storeSetActions = storeSetActions
        return [store, storeSetActions]
    }
    async reduce(method: ReducerMethodT, query: Record<string, any>): Promise<Response | null> {
        try {
            const [nextStore, response] = await method(this.currentStore, query)
            this.currentStore = udpateStore(this.storeSetActions, this.currentStore, nextStore)
            return response
        } catch (error) {
            console.error(error)
            alert(error)
        }
        return null
    }
    async orderedReducers(
        reducers: {
            method: ReducerMethodT
            query: Record<string, any>
        }[]
    ): Promise<void> {
        const prevStore = this.currentStore
        try {
            for (let index = 0; index < reducers.length; index++) {
                const { method, query } = reducers[index]
                const [nextStore] = await method(this.currentStore, query)
                this.currentStore = nextStore
            }
        } catch (error) {
            console.error(error)
            alert(error)
        }
        udpateStore(this.storeSetActions, prevStore, this.currentStore)
    }
}

const state = new State()

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

    if (needsInitialize) {
        if (context.channelId) {
            state.orderedReducers([
                {
                    method: reducers.columns.channel.create,
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
