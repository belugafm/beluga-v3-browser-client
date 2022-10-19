import { Response } from "../../../../api"
import { StoreT } from "./store"
import { createContext } from "react"

export type ReducerT = (
    method: (store: StoreT, query: Record<string, any>) => StoreT,
    query: Record<string, any>
) => void

export type AsyncReducerT = (
    method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>,
    query: Record<string, any>
) => Promise<Response | null>

export type AsyncSequentialReducerT = (
    reducers: {
        method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>
        query: Record<string, any>
    }[]
) => Promise<void>

export type ReducersT = {
    reducer: ReducerT
    asyncReducer: AsyncReducerT
    asyncSequentialReducer: AsyncSequentialReducerT
}

export type ReducerMethodT<T> = (store: StoreT, query: T) => StoreT
export type AsyncReducerMethodT<T> = (store: StoreT, query: T) => Promise<[StoreT, Response | null]>

export const ReducerContext = createContext<ReducersT>({
    reducer: null,
    asyncReducer: null,
    asyncSequentialReducer: null,
})
