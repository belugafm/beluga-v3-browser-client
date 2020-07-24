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
    const status = nextDomainData.statuses.get(status_id)
    status.deleted = true
    nextDomainData.statuses.set(status_id, status)
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
    {
        const status = store.domainData.statuses.get(status_id)
        if (status == null) {
            return [store, null]
        }
        if (status.deleted) {
            return [store, null]
        }
    }
    const nextDomainData = {
        statuses: copy_statuses(store.domainData.statuses),
        users: copy_users(store.domainData.users),
        channels: copy_channels(store.domainData.channels),
        communities: copy_communities(store.domainData.communities),
    }
    const status = nextDomainData.statuses.get(status_id)
    status.deleted = true
    nextDomainData.statuses.set(status_id, status)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        null,
    ]
}

export const statuses = { show, update, destroy, mark_as_deleted }
