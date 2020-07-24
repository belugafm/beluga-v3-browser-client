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
    queue: Promise<void> = new Promise((resolve) => resolve())
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
        return new Promise((resolve) => {
            this.queue = this.queue.then(async () => {
                try {
                    const [nextStore, response] = await method(this.currentStore, query)
                    this.currentStore = udpateStore(
                        this.storeSetActions,
                        this.currentStore,
                        nextStore
                    )
                    resolve(response)
                } catch (error) {
                    console.error(error)
                    alert(error)
                }
                resolve(null)
            })
        })
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

type WebsocketMessage = {
    operation: string
    model: string
    document_id: any
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
        const ws = new WebSocket("ws://localhost.beluga.fm:9001")
        ws.addEventListener("open", (event) => {
            console.log("open websocket")
        })
        ws.addEventListener("message", (event) => {
            try {
                const data: WebsocketMessage = JSON.parse(event.data)
                console.log("websocket")
                console.log(data)
                if (data.model === "status") {
                    const status_id = data.document_id
                    if (data.operation === "delete") {
                        state.reduce(reducers.statuses.mark_as_deleted, {
                            status_id,
                        })
                    } else if (data.operation === "insert") {
                    } else if (data.operation === "update") {
                        state.reduce(reducers.statuses.show, {
                            status_id,
                        })
                    }
                }
            } catch (error) {}
        })
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
