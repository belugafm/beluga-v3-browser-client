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
    if (nextDomainData.statuses.equals(prevDomainData.statuses) !== true) {
        nextDomainData.statuses.lastModified = Date.now()
        setActions.setStatuses(nextDomainData.statuses)
    }
    if (nextDomainData.users.equals(prevDomainData.users) !== true) {
        nextDomainData.users.lastModified = Date.now()
        setActions.setUsers(nextDomainData.users)
    }
    if (nextDomainData.channels.equals(prevDomainData.channels) !== true) {
        nextDomainData.channels.lastModified = Date.now()
        setActions.setChannels(nextDomainData.channels)
    }
    if (nextDomainData.communities.equals(prevDomainData.communities) !== true) {
        nextDomainData.communities.lastModified = Date.now()
        setActions.setCommunities(nextDomainData.communities)
    }
    if (nextDomainData.mutedUserIds.equals(prevDomainData.mutedUserIds) !== true) {
        setActions.setMutedUserIds(nextDomainData.mutedUserIds)
    }
    if (nextDomainData.blockedUserIds.equals(prevDomainData.blockedUserIds) !== true) {
        setActions.setMutedUserIds(nextDomainData.blockedUserIds)
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
