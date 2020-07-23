import { StoreT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../data"

const create = async (
    store: StoreT,
    query: Record<string, any>
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
    query: Record<string, any>
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
