import { AppStateSetActionT, AppStateT } from "./app"
import { DomainDataSetActionT, DomainDataT } from "./data/types"

import { Response } from "../../../api"
import { createContext } from "react"

export type StoreT = {
    domainData: DomainDataT
    appState: AppStateT
}

export type StoreSetActionsT = {
    domainData: DomainDataSetActionT
    appState: AppStateSetActionT
}

export type AsyncReducerT = (
    method: (storeData: StoreT, query: Record<string, any>) => Promise<[StoreT, Response | null]>,
    query: Record<string, any>
) => Promise<Response | null>

export type AsyncOrderedReducerT = (
    reducers: {
        method: (
            storeData: StoreT,
            query: Record<string, any>
        ) => Promise<[StoreT, Response | null]>
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

export const ChatReducerContext = createContext(context)
