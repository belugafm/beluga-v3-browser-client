import React, { useContext } from "react"

import { AppStateContext } from "../../../state/chat/store/app_state"
import { useTheme } from "../../theme"
import { getStyle } from "../../layout/sidebar"
import { ContentColumnComponent } from "./column"

export const ContentGridComponent = () => {
    const appState = useContext(AppStateContext)
    const [theme] = useTheme()
    return (
        <>
            <div className="grid-container">
                <div className="grid">
                    {appState.contents.map((contentRows, index) => {
                        return (
                            <ContentColumnComponent
                                key={index}
                                contentRows={contentRows}
                                theme={theme}
                            />
                        )
                    })}
                    <div className="empty-column"></div>
                </div>
            </div>
            <style jsx>{`
                .grid-container {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
            `}</style>
            <style jsx>{`
                .grid-container {
                    flex: 0 1 auto;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    border-radius: 0 12px 12px 0;
                    overflow: hidden;
                    transition-duration: 0.2s;
                }
                .grid {
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    flex: 1 1 auto;
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
