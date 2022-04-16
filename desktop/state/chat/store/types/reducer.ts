import { Response } from "../../../../api"
import { StoreT } from "./store"
import { createContext } from "react"

export type AsyncReducerT = (
    method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>,
    query: Record<string, any>
) => Promise<Response | null>

export type AsyncOrderedReducerT = (
    reducers: {
        method: (store: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>
        query: Record<string, any>
    }[]
) => Promise<void>

export type AsyncReducersT = {
    reducer: AsyncReducerT
    orderedReducers: AsyncOrderedReducerT
}

export type AsyncReducerMethodT<T> = (store: StoreT, query: T) => Promise<[StoreT, Response | null]>

const context: {
    reducer: AsyncReducerT
    orderedReducers: AsyncOrderedReducerT
} = {
    reducer: null,
    orderedReducers: null,
}

export const ReducerContext = createContext(context)
