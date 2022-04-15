import * as WebAPI from "../../../../api"

import { StoreT } from "../../store/reducer"
import { fetch } from "../../store/domain_data"

const show = async (
    store: StoreT,
    query: Parameters<typeof WebAPI.user.show>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.user.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const users = { show }
