import { StoreT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../data"

const create = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.favorites.create, query)
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
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        WebAPI.favorites.destroy,
        query
    )
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const favorites = { create, destroy }
