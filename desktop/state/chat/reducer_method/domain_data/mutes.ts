import * as api from "../../../../api"

import { StoreT } from "../../store/types/store"
import { fetch } from "../../store/domain_data"

const create = async (
    store: StoreT,
    query: Parameters<typeof api.mutes.create>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.mutes.create, query)
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
    query: Parameters<typeof api.mutes.destroy>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.mutes.destroy, query)

    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const mutes = { create, destroy }
