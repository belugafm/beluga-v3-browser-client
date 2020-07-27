import { StoreT } from "../state/reducer"
import * as WebAPI from "../../../api"
import { fetch, copy_statuses, DomainDataT } from "../state/data"

const show = async (
    store: StoreT,
    query: Parameters<typeof WebAPI.statuses.show>[0]
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
    query: Parameters<typeof WebAPI.statuses.update>[0]
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
    query: { statusId: string }
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.destroy, query)
    const { statusId } = query
    const status = nextDomainData.statuses.get(statusId)
    status.deleted = true
    status.updated_at = Date.now()
    nextDomainData.statuses.update(statusId, status)
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
    query: { statusId: string }
): Promise<[StoreT, null]> => {
    const { statusId } = query
    {
        const status = store.domainData.statuses.get(statusId)
        if (status == null) {
            return [store, null]
        }
        if (status.deleted) {
            return [store, null]
        }
    }
    const nextDomainData: DomainDataT = {
        statuses: copy_statuses(store.domainData.statuses),
        users: store.domainData.users,
        channels: store.domainData.channels,
        communities: store.domainData.communities,
        mutedUserIds: store.domainData.mutedUserIds,
        blockedUserIds: store.domainData.blockedUserIds,
    }
    const status = nextDomainData.statuses.get(statusId)
    status.deleted = true
    status.updated_at = Date.now()
    nextDomainData.statuses.update(statusId, status)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        null,
    ]
}

export const statuses = { show, update, destroy, mark_as_deleted }
