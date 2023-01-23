import * as api from "../../../../../api"
import { Response } from "../../../../../api"

import { StoreT } from "../../types/store"
import { copyDomainData } from "../../domain_data/copy"
import { fetch } from "../fetch"
import { MessageId } from "../../../../../api/object"

export const showMessage = async (
    store: StoreT,
    query: Parameters<typeof api.messages.show>[0]
): Promise<[StoreT, Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.messages.show, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}
export const postMessage = async (
    store: StoreT,
    query: Parameters<typeof api.messages.post>[0]
): Promise<[StoreT, Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.messages.post, query)
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}
export const deleteMessage = async (
    store: StoreT,
    query: { id: MessageId }
): Promise<[StoreT, Response | null]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.messages.delete, query)
    const messageId = query.id
    const message = nextDomainData.messages.get(messageId)
    if (message) {
        message.deleted = true
        message._internal_updated_at = Date.now()
        nextDomainData.messages.update(messageId, message)
    }
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}
export const markMessageAsDeleted = async (
    store: StoreT,
    query: { messageId: MessageId }
): Promise<[StoreT, null]> => {
    const { messageId } = query
    {
        const message = store.domainData.messages.get(messageId)
        if (message == null) {
            return [store, null]
        }
        if (message.deleted) {
            return [store, null]
        }
    }
    const nextDomainData = copyDomainData(store.domainData)
    const message = nextDomainData.messages.get(messageId)
    if (message) {
        message.deleted = true
        message._internal_updated_at = Date.now()
        nextDomainData.messages.update(messageId, message)
    }
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        null,
    ]
}

export const message = {
    show: showMessage,
    post: postMessage,
    delete: deleteMessage,
    markAsDeleted: markMessageAsDeleted,
}
