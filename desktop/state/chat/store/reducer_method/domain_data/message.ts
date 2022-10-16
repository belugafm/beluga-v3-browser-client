import * as api from "../../../../../api"

import { StoreT } from "../../types/store"
import { copyDomainData } from "../../domain_data/copy"
import { fetch } from "../../domain_data"
import { MessageId } from "../../../../../api/object"

export const showMessage = async (
    store: StoreT,
    query: Parameters<typeof api.message.show>[0]
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.message.show, query)
    if (response != null && response.ok == true) {
        // データが変わってなくても強制再描画
        const message = nextDomainData.messages.get(response.message.id)
        message._internal_updated_at = Date.now()
        nextDomainData.messages.update(response.message.id, message)
    }
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
export const deleteMessage = async (
    store: StoreT,
    query: { messageId: MessageId }
): Promise<[StoreT, api.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, api.message.delete, query)
    const { messageId } = query
    const message = nextDomainData.messages.get(messageId)
    message.deleted = true
    message._internal_updated_at = Date.now()
    nextDomainData.messages.update(messageId, message)
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
    message.deleted = true
    message._internal_updated_at = Date.now()
    nextDomainData.messages.update(messageId, message)
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
