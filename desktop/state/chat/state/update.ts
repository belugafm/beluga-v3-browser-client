import { DomainDataT, DomainDataSetActionT } from "./data"
import { AppStateT, AppStateSetActionT } from "./app"
import equals from "deep-equal"
import { StoreSetActionsT, StoreT } from "./reducer"

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
        setActions.setBlockedUserIds(nextDomainData.blockedUserIds)
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
