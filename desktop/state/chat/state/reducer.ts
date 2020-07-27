import { DomainDataT, DomainDataSetActionT } from "./data"
import { AppStateT, AppStateSetActionT } from "./app"
import { createContext } from "react"
import { Response } from "../../../api"

export type StoreT = {
    domainData: DomainDataT
    appState: AppStateT
}

export type ReducersT = {
    reducer: ReducerT
    orderedReducers: OrderedReducerT
}

export type StoreSetActionsT = {
    domainData: DomainDataSetActionT
    appState: AppStateSetActionT
}

export type ReducerT = (
    method: (storeData: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>,
    query: Record<string, any>
) => Promise<Response | null>

export type OrderedReducerT = (
    reducers: {
        method: (
            storeData: StoreT,
            query: Record<string, any>
        ) => Promise<[StoreT, Response | null]>
        query: Record<string, any>
    }[]
) => Promise<void>

export type ReducerMethodT<T> = (store: StoreT, query: T) => Promise<[StoreT, Response | null]>

const context: {
    reducer: ReducerT
    orderedReducers: OrderedReducerT
} = {
    reducer: null,
    orderedReducers: null,
}

export const ChatReducerContext = createContext(context)
