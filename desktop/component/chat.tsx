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
                            <div className="sidebar"></div>
                            <div className="columns">
                                <ChatColumnContainerComponent />
                            </div>
                            <style jsx>{`
                                .sidebar {
                                    width: 72px;
                                    background-color: black;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    bottom: 0;
                                    display: flex;
                                }
                                .columns {
                                    position: absolute;
                                    top: 0;
                                    left: 72px;
                                    right: 0;
                                    bottom: 0;
                                    display: flex;
                                    flex: 1 1 auto;
                                }
                            `}</style>
                            <style jsx global>{`
                                html,
                                body {
                                    width: 100%;
                                    height: 100%;
                                    line-height: 1;
                                    margin: 0;
                                    padding: 0;
                                }
                                #__next {
                                    overflow: hidden;
                                    display: flex;
                                    flex-direction: column;
                                    width: 100%;
                                    height: 100%;
                                }
                                #__next > div {
                                    position: relative;
                                    flex: 1 1 auto;
                                    z-index: auto;
                                }
                            `}</style>
                        </StatusActions.Provider>
                    </ChatActions.Provider>
                </ChatReducerContext.Provider>
            </ChatDomainDataContext.Provider>
        </ChatAppStateContext.Provider>
    )
}
