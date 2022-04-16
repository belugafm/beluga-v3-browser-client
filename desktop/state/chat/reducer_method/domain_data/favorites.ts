import * as api from "../../../../api"

import { StoreT } from "../../store/types/reducer"
import { fetch } from "../../store/domain_data"

const create = async (
    store: StoreT,
    query: Parameters<typeof api.favorites.create>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.favorites.create, query)
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
    query: Parameters<typeof api.favorites.destroy>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.favorites.destroy, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const favorites = { create, destroy }
