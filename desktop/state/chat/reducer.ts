import { DomainDataT } from "./data"
import { AppStateDataT } from "./app"
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
    prevStore: StoreContextT,
    method: (
        prevStore: StoreDataT | StoreContextT,
        query: Record<string, any>
    ) => Promise<[StoreDataT, Response | null]>,
    query: Record<string, any>
) => Promise<Response | null>

export const udpateStoreData = (
    prevStore: StoreContextT,
    nextStoreData: StoreDataT
) => {
    const prevDomainData = prevStore.domainData
    const prevAppState = prevStore.appState
    const nextDomainData = nextStoreData.domainData
    const nextAppState = nextStoreData.appState

    if (
        equals(prevDomainData.statusesById, nextDomainData.statusesById) !==
        true
    ) {
        prevDomainData.setStatusesById(nextDomainData.statusesById)
    }
    if (equals(prevDomainData.usersById, nextDomainData.usersById) !== true) {
        prevDomainData.setUsersById(nextDomainData.usersById)
    }
    if (
        equals(prevDomainData.channelsById, nextDomainData.channelsById) !==
        true
    ) {
        prevDomainData.setChannelsById(nextDomainData.channelsById)
    }
    if (
        equals(
            prevDomainData.communitiesById,
            nextDomainData.communitiesById
        ) !== true
    ) {
        prevDomainData.setCommunitiesById(nextDomainData.communitiesById)
    }

    if (equals(prevAppState.columns, nextAppState.columns) !== true) {
        prevAppState.setColumns(nextAppState.columns)
    }

    console.info("udpateStoreData")
    console.info({ nextDomainData, nextAppState })
}

const context: {
    reducer: ReducerT
} = {
    reducer: null,
}

export const ChatReducerContext = createContext(context)
