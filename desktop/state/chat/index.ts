import { useChatAppState } from "./app"
import { useChatDomainData } from "./data"
import { useState } from "react"
import * as reducers from "./reducers"
import { StoreDataT, udpateStoreData } from "./reducer"
import { Response } from "../../api"

export const useChatStore = ({
    context,
}: {
    context: {
        channelId?: string
        communityId?: string
        statusId?: string
        userId?: string
    }
}) => {
    console.info("useChatState")
    const domainData = useChatDomainData()
    const appState = useChatAppState()
    const [needsInitialize, setNeedsInitialize] = useState(true)

    const store = { domainData, appState }

    const reducer = async (
        storeData: StoreDataT,
        method: (
            store: StoreDataT,
            query: Record<string, any>
        ) => Promise<[StoreDataT, Response | null]>,
        query: Record<string, any>
    ): Promise<Response | null> => {
        const [nextStoreData, response] = await method(storeData, query)
        udpateStoreData(store, nextStoreData)
        return response
    }

    const orderedReducers = async (
        storeData: StoreDataT,
        reducers: {
            method: (
                store: StoreDataT,
                query: Record<string, any>
            ) => Promise<[StoreDataT, Response]>
            query: Record<string, any>
        }[]
    ): Promise<void> => {
        for (let index = 0; index < reducers.length; index++) {
            const { method, query } = reducers[index]
            const [nextStoreData, response] = await method(storeData, query)
            storeData = nextStoreData
        }
        udpateStoreData(store, storeData)
    }

    if (needsInitialize) {
        if (context.channelId) {
            orderedReducers(store, [
                {
                    method: reducers.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 0,
                    },
                },
                {
                    method: reducers.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 1,
                    },
                },
                {
                    method: reducers.columns.channel.create,
                    query: {
                        channelId: context.channelId,
                        columnIndex: 2,
                    },
                },
            ])
        }
        setNeedsInitialize(false)
    }

    return { domainData, appState, reducer, orderedReducers }
}
