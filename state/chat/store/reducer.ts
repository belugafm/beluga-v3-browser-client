import { AsyncReducerMethodT, ReducerMethodT, ReducersT } from "./types/reducer"
import { SetStoreActionsT, StoreT } from "./types/store"
import { udpateStore } from "./update_store"
import { Response } from "../../../api"

var queue: Promise<void> = new Promise((resolve) => resolve())

export const useReducers = (store: StoreT, setStoreActions: SetStoreActionsT): ReducersT => {
    const version = Date.now()
    const reducer = <T>(method: ReducerMethodT<T>, query: T): void => {
        try {
            const nextStore = method(store, query)
            udpateStore(setStoreActions, store, nextStore)
        } catch (error) {
            console.error(error)
        }
    }
    const asyncReducer = <T>(
        method: AsyncReducerMethodT<T>,
        query: T
    ): Promise<Response | null> => {
        return new Promise((resolve) => {
            queue = queue.then(async () => {
                try {
                    const [nextStore, response] = await method(store, query)
                    udpateStore(setStoreActions, store, nextStore)
                    resolve(response)
                } catch (error) {
                    console.error("asyncReducer", error)
                }
                resolve(null)
            })
        })
    }
    asyncReducer.version = version
    const asyncSequentialReducer = async <T>(
        asyncReducers: {
            method: AsyncReducerMethodT<T>
            query: T
        }[]
    ): Promise<void> => {
        queue = queue.then(async () => {
            try {
                let currentStore = store
                for (let index = 0; index < asyncReducers.length; index++) {
                    const { method, query } = asyncReducers[index]
                    const [nextStore] = await method(currentStore, query)
                    currentStore = udpateStore(setStoreActions, currentStore, nextStore)
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
    return { reducer, asyncReducer, asyncSequentialReducer }
}
