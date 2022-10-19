import * as api from "../../../../../api"

import { StoreT } from "../../types/store"
import { fetch } from "../fetch"

export const show = async (
    store: StoreT,
    query: Parameters<typeof api.channel.show>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.channel.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const channel = { show }
