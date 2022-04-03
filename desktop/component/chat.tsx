import { ChannelGroupObjectT, ChannelObjectT, MessageObjectT } from "../api/object"
import { ChatActions, useChatActions } from "../state/chat/store/actions"
import { Context, useChatStore } from "../state/chat"
import { MessageActions, useMessageActions } from "../state/chat/components/message"

import { ChatAppStateContext } from "../state/chat/store/app_state"
import { ChatColumnContainerComponent } from "./chat/columns"
import { ChatDomainDataContext } from "../state/chat/store/domain_data"
import { ChatReducerContext } from "../state/chat/store/reducer"
import React from "react"

export const ChatComponent = ({ context }: { context: Context }) => {
    const { domainData, appState, reducer, orderedReducers } = useChatStore(context)
    const reducers = { reducer, orderedReducers }
    const statusActions = useMessageActions(reducers)
    const chatActions = useChatActions({ appState, reducers })
    return (
        <ChatAppStateContext.Provider value={appState}>
            <ChatDomainDataContext.Provider value={domainData}>
                <ChatReducerContext.Provider value={reducers}>
                    <ChatActions.Provider value={chatActions}>
                        <MessageActions.Provider value={statusActions}>
                            <div className="sidebar"></div>
                            <div className="columns">
                                <ChatColumnContainerComponent />
                            </div>
                        </MessageActions.Provider>
                    </ChatActions.Provider>
                </ChatReducerContext.Provider>
            </ChatDomainDataContext.Provider>
        </ChatAppStateContext.Provider>
    )
}
