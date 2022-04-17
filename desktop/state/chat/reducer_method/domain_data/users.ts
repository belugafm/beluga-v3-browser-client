import * as api from "../../../../api"

import { StoreT } from "../../store/types/store"
import { fetch } from "../../store/domain_data"

const show = async (
    store: StoreT,
    query: Parameters<typeof api.user.show>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.user.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const users = { show }
