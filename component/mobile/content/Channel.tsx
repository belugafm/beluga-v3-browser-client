import React, { useContext } from "react"
import { ThemeT, useTheme } from "../../Theme"

import { TooltipActionContext } from "../../../state/component/tooltip"
import { TimelineComponent } from "../Timeline"
import { PostboxComponent } from "../Postbox"
import { AppStateContext } from "../../../state/chat/store/app_state"

export const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            backgroundColor: "rgba(30, 30, 30, 0.98)",
            border: "none",
        }
    }
    throw new Error()
}

export const ChannelContentComponent = () => {
    const tooltipAction = useContext(TooltipActionContext)
    const appState = useContext(AppStateContext)
    const content = appState.contents[0][0]
    const [theme] = useTheme()
    return (
        <>
            <div className="content">
                <TimelineComponent content={content} />
                <div className="postbox">
                    <PostboxComponent content={content} tooltipAction={tooltipAction} />
                </div>
            </div>
            <style jsx>{`
                .content {
                    height: 100dvh;
                    width: 100dvw;
                    display: flex;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .postbox {
                    flex: 0 0 auto;
                    z-index: 2;
                }
            `}</style>
            <style jsx>{`
                .content-container {
                    color: ${getStyle(theme)["color"]};
                }
                .content {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
            `}</style>
        </>
    )
}
