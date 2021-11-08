import * as WebAPI from "../../../api"

import { StoreT } from "../state/reducer"
import { fetch } from "../state/data"

const create = async (
    store: StoreT,
    query: Parameters<typeof WebAPI.blocks.create>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.blocks.create, query)
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
    query: Parameters<typeof WebAPI.blocks.destroy>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.blocks.destroy, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const blocks = { create, destroy }
