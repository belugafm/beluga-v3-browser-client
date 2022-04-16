import * as WebAPI from "../../../../api"

import { StoreT } from "../../store/types/reducer"
import { fetch } from "../../store/domain_data"

const create = async (
    store: StoreT,
    query: Parameters<typeof WebAPI.mutes.create>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.mutes.create, query)
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
    query: Parameters<typeof WebAPI.mutes.destroy>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.mutes.destroy, query)

    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const mutes = { create, destroy }
