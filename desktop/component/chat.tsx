import React from "react"
import { ChatAppStateContext } from "../state/chat/app"
import { ChatColumnContainerComponent } from "./chat/columns"
import { useChatStore } from "../state/chat"
import { ChatDomainDataContext } from "../state/chat/data"

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
    const { domainData, appState, updateColumnTimeline } = useChatStore({
        context,
    })
    return (
        <ChatAppStateContext.Provider
            value={Object.assign({}, appState, {
                updateColumnTimeline,
            })}>
            <ChatDomainDataContext.Provider value={domainData}>
                <ChatColumnContainerComponent />
            </ChatDomainDataContext.Provider>
        </ChatAppStateContext.Provider>
    )
}
