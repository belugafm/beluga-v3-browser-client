import * as api from "../../../../../api"

import { StoreT } from "../../types/store"
import { fetch } from "../fetch"

const create = async (
    store: StoreT,
    query: Parameters<typeof api.likes.create>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.likes.create, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const likes = { create }
