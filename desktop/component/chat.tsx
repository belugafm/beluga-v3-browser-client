import React from "react"
import { ChatAppStateContext } from "../state/chat/state/app"
import { ChatColumnContainerComponent } from "./chat/columns"
import { useChatStore } from "../state/chat"
import { useChatActions, ChatActions } from "../state/chat/actions"
import { ChatDomainDataContext } from "../state/chat/state/data"
import { ChatReducerContext } from "../state/chat/state/reducer"
import { StatusActions, useStatusActions } from "../state/status"

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
    const statusActions = useStatusActions(reducers)
    const chatActions = useChatActions({ appState, reducers })
    return (
        <ChatAppStateContext.Provider value={appState}>
            <ChatDomainDataContext.Provider value={domainData}>
                <ChatReducerContext.Provider value={reducers}>
                    <ChatActions.Provider value={chatActions}>
                        <StatusActions.Provider value={statusActions}>
                            <ChatColumnContainerComponent />
                        </StatusActions.Provider>
                    </ChatActions.Provider>
                </ChatReducerContext.Provider>
            </ChatDomainDataContext.Provider>
        </ChatAppStateContext.Provider>
    )
}
