import { StoreT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch, copy_statuses, copy_users, copy_channels, copy_communities } from "../state/data"

const show = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

const update = async (
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

const destroy = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.destroy, query)
    const { status_id } = query
    nextDomainData.statusesById[status_id].deleted = true
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}

const mark_as_deleted = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, null]> => {
    const { status_id } = query
    if (store.domainData.statusesById[status_id].deleted) {
        return [store, null]
    }
    let nextDomainData = {
        statusesById: copy_statuses(store.domainData.statusesById),
        usersById: copy_users(store.domainData.usersById),
        channelsById: copy_channels(store.domainData.channelsById),
        communitiesById: copy_communities(store.domainData.communitiesById),
    }
    nextDomainData.statusesById[status_id].deleted = true
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        null,
    ]
}

export const statuses = { show, update, destroy, mark_as_deleted }
