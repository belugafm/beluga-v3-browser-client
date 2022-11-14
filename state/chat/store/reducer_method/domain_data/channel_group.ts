import * as api from "../../../../../api"

import { StoreT } from "../../types/store"
import { fetch } from "../fetch"

export const show = async (
    store: StoreT,
    query: Parameters<typeof api.channelGroup.show>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.channelGroup.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const listChannels = async (
    store: StoreT,
    query: Parameters<typeof api.channelGroup.listChannels>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        api.channelGroup.listChannels,
        query
    )
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const listChannelGroupss = async (
    store: StoreT,
    query: Parameters<typeof api.channelGroup.listChannelGroupss>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        api.channelGroup.listChannelGroupss,
        query
    )
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const channelGroup = {
    show,
    listChannels,
    listChannelGroupss,
}
