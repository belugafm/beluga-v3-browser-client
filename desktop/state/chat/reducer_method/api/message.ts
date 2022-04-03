import * as api from "../../../../api"

import { DomainDataT } from "../../store/domain_data/types"
import { StoreT } from "../../store/reducer"
import copy from "../../store/domain_data/copy"
import { fetch } from "../../store/domain_data"

const show = async (
    store: StoreT,
    query: Parameters<typeof api.message.show>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.message.show, query)
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
    query: Parameters<typeof api.message.post>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.message.post, query)
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
    query: { messageId: number }
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.message.destroy, query)
    const { messageId } = query
    const status = nextDomainData.messages.get(messageId)
    status.deleted = true
    status.updated_at = Date.now()
    nextDomainData.messages.update(messageId, status)
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
    query: { messageId: number }
): Promise<[StoreT, null]> => {
    const { messageId } = query
    {
        const status = store.domainData.messages.get(messageId)
        if (status == null) {
            return [store, null]
        }
        if (status.deleted) {
            return [store, null]
        }
    }
    const nextDomainData: DomainDataT = {
        messages: copy.messages(store.domainData.messages),
        users: store.domainData.users,
        channels: store.domainData.channels,
        channelGroups: store.domainData.channelGroups,
        mutedUserIds: store.domainData.mutedUserIds,
        blockedUserIds: store.domainData.blockedUserIds,
    }
    const status = nextDomainData.messages.get(messageId)
    status.deleted = true
    status.updated_at = Date.now()
    nextDomainData.messages.update(messageId, status)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        null,
    ]
}

export const message = { show, update, destroy, mark_as_deleted }
