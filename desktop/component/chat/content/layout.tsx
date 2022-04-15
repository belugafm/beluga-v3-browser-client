import { Action, useAction } from "../../../state/chat/store/action"
import { MessageAction, useMessageAction } from "../../../state/chat/components/message"

import { AppStateContext } from "../../../state/chat/store/app_state"
import { ContentColumnComponent } from "./column"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { PageContextObjectT } from "../../../state/chat/store"
import React from "react"
import { ReducerContext } from "../../../state/chat/store/reducer"
import { useChatStore } from "../../../state/chat"

export const ContentGridComponent = ({ pageContext }: { pageContext: PageContextObjectT }) => {
    console.info("ContentGridComponent::render")
    const { domainData, appState, reducer, orderedReducers } = useChatStore(pageContext)
    const reducers = { reducer, orderedReducers }
    const messageAction = useMessageAction(reducers)
    const chatAction = useAction({ appState, reducers })
    return (
        <AppStateContext.Provider value={appState}>
            <DomainDataContext.Provider value={domainData}>
                <ReducerContext.Provider value={reducers}>
                    <Action.Provider value={chatAction}>
                        <MessageAction.Provider value={messageAction}>
                            <div className="grid-container">
                                <div className="grid">
                                    {appState.contents.map((contentRows, column) => {
                                        return (
                                            <ContentColumnComponent
                                                key={column}
                                                contentRows={contentRows}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                            <style jsx>{`
                                .grid-container {
                                    display: flex;
                                    flex-direction: column;
                                    overflow-y: hidden;
                                    overflow-x: scroll;
                                }
                                .grid {
                                    overflow: hidden;
                                    margin: 0 auto;
                                    display: inline-flex;
                                    flex-direction: row;
                                    height: calc(100vh - 80px);
                                    padding: 0 8px;
                                    box-sizing: border-box;
                                }
                                .grid-container::-webkit-scrollbar {
                                    width: 0px;
                                    height: 0px;
                                }
                                .grid-container::-webkit-scrollbar-thumb {
                                    border-radius: 10px;
                                    background-color: gray;
                                }
                                .grid-container::-webkit-scrollbar-track-piece {
                                    background-clip: padding-box;
                                    background-color: transparent;
                                    border-color: transparent;
                                }
                            `}</style>
                        </MessageAction.Provider>
                    </Action.Provider>
                </ReducerContext.Provider>
            </DomainDataContext.Provider>
        </AppStateContext.Provider>
    )
}
