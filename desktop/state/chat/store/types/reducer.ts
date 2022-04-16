import { Response } from "../../../../api"
import { StoreT } from "./store"
import { createContext } from "react"

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

export type AsyncReducersT = {
    reducer: AsyncReducerT
    sequentialReducer: AsyncSequentialReducerT
}

export type AsyncReducerMethodT<T> = (store: StoreT, query: T) => Promise<[StoreT, Response | null]>

export const ReducerContext = createContext<AsyncReducersT>({
    reducer: null,
    sequentialReducer: null,
})
