import { DomainDataT, DomainDataSetActionT } from "./state/data"
import { AppStateT, AppStateSetActionT } from "./state/app"
import equals from "deep-equal"
import { createContext } from "react"
import { Response } from "../../api"

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

function updateDomainData(
    setActions: DomainDataSetActionT,
    prevDomainData: DomainDataT,
    nextDomainData: DomainDataT
) {
    if (equals(prevDomainData.statusesById, nextDomainData.statusesById) !== true) {
        setActions.setStatusesById(nextDomainData.statusesById)
    }
    if (equals(prevDomainData.usersById, nextDomainData.usersById) !== true) {
        setActions.setUsersById(nextDomainData.usersById)
    }
    if (equals(prevDomainData.channelsById, nextDomainData.channelsById) !== true) {
        setActions.setChannelsById(nextDomainData.channelsById)
    }
    if (equals(prevDomainData.communitiesById, nextDomainData.communitiesById) !== true) {
        setActions.setCommunitiesById(nextDomainData.communitiesById)
    }
}

function updateAppState(
    setActions: AppStateSetActionT,
    prevAppState: AppStateT,
    nextAppState: AppStateT
) {
    if (equals(prevAppState.columns, nextAppState.columns) !== true) {
        setActions.setColumns(nextAppState.columns)
    }
}

export const udpateStore = (
    storeSetActions: StoreSetActionsT,
    prevStore: StoreT,
    nextStore: StoreT
) => {
    updateDomainData(storeSetActions.domainData, prevStore.domainData, nextStore.domainData)
    updateAppState(storeSetActions.appState, prevStore.appState, nextStore.appState)
    return nextStore
}

const context: {
    reducer: ReducerT
    orderedReducers: OrderedReducerT
} = {
    reducer: null,
    orderedReducers: null,
}

export const ChatReducerContext = createContext(context)
