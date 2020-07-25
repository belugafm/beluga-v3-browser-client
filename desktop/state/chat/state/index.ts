import { useChatAppState, ChatAppStateContext } from "./app"
import { useChatDomainData, ChatDomainDataContext } from "./data"
import { useContext } from "react"
import { StoreT, udpateStore, StoreSetActionsT, ChatReducerContext, ReducersT } from "../reducer"
import { Response } from "../../../api"

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

export type ReducerMethodT<T> = (store: StoreT, query: T) => Promise<[StoreT, Response | null]>

export class ChatState {
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
    reducer = <T>(method: ReducerMethodT<T>, query: T): Promise<Response | null> => {
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
    orderedReducers = async <T>(
        reducers: {
            method: ReducerMethodT<T>
            query: T
        }[]
    ): Promise<void> => {
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
