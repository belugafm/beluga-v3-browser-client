import { StoreT } from "../state/reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../state/data"

const show = async (
    store: StoreT,
    query: Parameters<typeof WebAPI.users.show>[0]
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.users.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const users = { show }
