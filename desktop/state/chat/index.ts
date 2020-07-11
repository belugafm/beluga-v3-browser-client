import { useChatAppState } from "./app"
import { useChatDomainData } from "./data"
import { useState } from "react"
import * as reducers from "./reducers"
import { StoreDataT, udpateStoreData, StoreContextT } from "./reducer"
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
        prevStore: StoreContextT,
        method: (
            prevStore: StoreDataT | StoreContextT,
            query: Record<string, any>
        ) => Promise<[StoreDataT, Response]>,
        query: Record<string, any>
    ): Promise<Response> => {
        const [nextStore, response] = await method(prevStore, query)
        udpateStoreData(prevStore, nextStore)
        return response
    }

    if (needsInitialize) {
        if (context.channelId) {
            reducer(store, reducers.columns.channel.create, {
                channelId: context.channelId,
                columnIndex: appState.columns.length,
            })
        }
        setNeedsInitialize(false)
    }

    return { domainData, appState, reducer }
}
