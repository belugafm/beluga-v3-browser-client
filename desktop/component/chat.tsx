import React from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"
import { useChatUIState, ChatUIStateContext } from "../state/chat/ui_state"
import { ChatColumnComponent } from "./chat/column"
import { ChatColumnContainerComponent } from "./chat/columns"

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
    const { columns, handleUpdateColumnTimeline } = useChatUIState({
        context: context,
    })
    return (
        <ChatUIStateContext.Provider
            value={{ columns, handleUpdateColumnTimeline }}>
            <ChatColumnContainerComponent />
        </ChatUIStateContext.Provider>
    )
}
