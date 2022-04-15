import * as WebAPI from "../../../../api"

import { StoreT } from "../../store/reducer"
import { fetch } from "../../store/domain_data"

const create = async (
    store: StoreT,
    query: Parameters<typeof WebAPI.likes.create>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.likes.create, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const likes = { create }
