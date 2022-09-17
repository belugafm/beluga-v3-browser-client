import * as api from "../../../../../api"

import { StoreT } from "../../types/store"
import { copyDomainData } from "../../domain_data/copy"
import { fetch } from "../../domain_data"
import { MessageId } from "../../../../../api/object"

export const message = {
    show: async (
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
    },
    post: async (
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
    },
    delete: async (
        store: StoreT,
        query: { messageId: MessageId }
    ): Promise<[StoreT, api.Response]> => {
        const [nextDomainData, response] = await fetch(store.domainData, api.message.delete, query)
        const { messageId } = query
        const message = nextDomainData.messages.get(messageId)
        message.deleted = true
        message.updated_at = Date.now()
        nextDomainData.messages.update(messageId, message)
        return [
            {
                domainData: nextDomainData,
                appState: store.appState,
            },
            response,
        ]
    },
    markAsDeleted: async (
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
        message.updated_at = Date.now()
        nextDomainData.messages.update(messageId, message)
        return [
            {
                domainData: nextDomainData,
                appState: store.appState,
            },
            null,
        ]
    },
}
