import { DomainDataT } from "./data"
import { AppStateDataT, AppStateContextT } from "./app"
import equals from "deep-equal"
import { createContext } from "react"
import { Response } from "../../api"

export type StoreDataT = {
    domainData: DomainDataT
    appState: AppStateDataT
}

export type StoreContextT = {
    domainData: DomainDataContextT
    appState: AppStateContextT
}

export type ReducerT = (
    storeData: StoreDataT,
    method: (
        storeData: StoreDataT,
        query: Record<string, any>
    ) => Promise<[StoreDataT, Response | null]>,
    query: Record<string, any>
) => Promise<Response | null>

export type OrderedReducerT = (
    storeData: StoreDataT,
    reducers: {
        method: (
            storeData: StoreDataT,
            query: Record<string, any>
        ) => Promise<[StoreDataT, Response | null]>
        query: Record<string, any>
    }[]
) => Promise<void>

export const udpateStoreData = (
    store: StoreContextT,
    nextStoreData: StoreDataT
) => {
    const domainData = store.domainData
    const appState = store.appState
    const nextDomainData = nextStoreData.domainData
    const nextAppState = nextStoreData.appState

    if (equals(domainData.statusesById, nextDomainData.statusesById) !== true) {
        domainData.setStatusesById(nextDomainData.statusesById)
    }
    if (equals(domainData.usersById, nextDomainData.usersById) !== true) {
        domainData.setUsersById(nextDomainData.usersById)
    }
    if (equals(domainData.channelsById, nextDomainData.channelsById) !== true) {
        domainData.setChannelsById(nextDomainData.channelsById)
    }
    if (
        equals(domainData.communitiesById, nextDomainData.communitiesById) !==
        true
    ) {
        domainData.setCommunitiesById(nextDomainData.communitiesById)
    }

    console.log(equals(appState.columns, nextAppState.columns))
    if (equals(appState.columns, nextAppState.columns) !== true) {
        console.log(nextAppState.columns)
        appState.setColumns(nextAppState.columns)
    }

    console.info("udpateStoreData")
    console.info({ nextDomainData, nextAppState })
}

const context: {
    reducer: ReducerT
    orderedReducers: OrderedReducerT
} = {
    reducer: null,
    orderedReducers: null,
}

export const ChatReducerContext = createContext(context)
