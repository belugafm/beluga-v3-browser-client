import React, { useContext } from "react"

import { AppStateContext } from "../../../state/chat/store/app_state"
import { ContentColumnComponent } from "./column"

export const ContentGridComponent = () => {
    console.debug("ContentGridComponent::render")
    const appState = useContext(AppStateContext)
    return (
        <>
            <div className="grid-container">
                <div className="grid">
                    <div className="empty-column"></div>
                    {appState.contents.map((contentRows, index) => {
                        return <ContentColumnComponent key={index} contentRows={contentRows} />
                    })}
                    <div className="empty-column"></div>
                </div>
            </div>
            <style jsx>{`
                .grid-container {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 80px);
                    z-index: 1;
                }
                .grid {
                    display: flex;
                    flex-direction: row;
                    padding: 0 8px;
                    box-sizing: border-box;
                    flex: 1 1 0;
                    overflow-y: hidden;
                    overflow-x: scroll;
                }
                .grid::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }
                .grid::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .grid::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .empty-column {
                    flex: 1 1 auto;
                }
            `}</style>
        </>
    )
}
