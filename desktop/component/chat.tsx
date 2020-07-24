import React from "react"
import { ChatAppStateContext } from "../state/chat/state/app"
import { ChatColumnContainerComponent } from "./chat/columns"
import { useChatStore } from "../state/chat"
import { ChatDomainDataContext } from "../state/chat/state/data"
import { ChatReducerContext } from "../state/chat/reducer"
import { StatusMethods, useStatusMethods } from "../state/status"

export const ChatComponent = ({
    context,
}: {
    context: {
        channelId?: string
        communityId?: string
        statusId?: string
        userId?: string
    }
}) => {
    const { domainData, appState, reducer, orderedReducers } = useChatStore({
        context,
    })
    const reducers = { reducer, orderedReducers }
    const statusMethods = useStatusMethods(reducers)
    return (
        <ChatAppStateContext.Provider value={appState}>
            <ChatDomainDataContext.Provider value={domainData}>
                <ChatReducerContext.Provider value={reducers}>
                    <StatusMethods.Provider value={statusMethods}>
                        <ChatColumnContainerComponent />
                    </StatusMethods.Provider>
                </ChatReducerContext.Provider>
            </ChatDomainDataContext.Provider>
        </ChatAppStateContext.Provider>
    )
}
