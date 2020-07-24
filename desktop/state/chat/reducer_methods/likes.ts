import { StoreT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../state/data"

const create = async (
    store: StoreT,
    query: Record<string, any>
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
