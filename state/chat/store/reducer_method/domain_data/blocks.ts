import * as api from "../../../../../api"

import { StoreT } from "../../types/store"
import { fetch } from "../fetch"

const create = async (
    store: StoreT,
    query: Parameters<typeof api.blocks.create>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.blocks.create, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

const destroy = async (
    store: StoreT,
    query: Parameters<typeof api.blocks.destroy>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.blocks.destroy, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const blocks = { create, destroy }
