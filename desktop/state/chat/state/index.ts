import { AsyncReducerMethodT, StoreSetActionsT, StoreT } from "./reducer"

import { Response } from "../../../api"
import { udpateStore } from "./update"
import { useChatAppState } from "./app"
import { useChatDomainData } from "./data"

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
    asyncReduce = <T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> => {
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
    asyncOrderedReduce = async <T>(
        reducers: {
            method: AsyncReducerMethodT<T>
            query: T
        }[]
    ): Promise<void> => {
        // TODO: queueの更新は？
        try {
            for (let index = 0; index < reducers.length; index++) {
                const { method, query } = reducers[index]
                const [nextStore] = await method(this.currentStore, query)
                this.currentStore = udpateStore(this.storeSetActions, this.currentStore, nextStore)
            }
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }
}
