import { AppStateSetActionT, AppStateT } from "./types/app_state"
import { DomainDataSetActionT, DomainDataT } from "./types/domain_data"
import { StoreSetActionsT, StoreT } from "./types/store"

import deepEquals from "deep-equal"

function updateDomainData(
    setActions: DomainDataSetActionT,
    prevDomainData: DomainDataT,
    nextDomainData: DomainDataT
) {
    if (nextDomainData.messages.equals(prevDomainData.messages) !== true) {
        nextDomainData.messages.lastModified = Date.now()
        setActions.setMessages(nextDomainData.messages)
    }
    if (nextDomainData.users.equals(prevDomainData.users) !== true) {
        nextDomainData.users.lastModified = Date.now()
        setActions.setUsers(nextDomainData.users)
    }
    if (nextDomainData.channels.equals(prevDomainData.channels) !== true) {
        nextDomainData.channels.lastModified = Date.now()
        setActions.setChannels(nextDomainData.channels)
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
    if (deepEquals(prevAppState.contents, nextAppState.contents) !== true) {
        setActions.setContents(nextAppState.contents)
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
