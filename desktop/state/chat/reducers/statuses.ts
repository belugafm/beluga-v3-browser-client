import { StoreT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../data"

export const update = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.update, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const like = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.like, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

export const destroy = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.destroy, query)
    const { status_id } = query
    nextDomainData.statusesById[status_id].is_deleted = true
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}
