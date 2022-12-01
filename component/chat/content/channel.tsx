import React, { useContext } from "react"
import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { HeaderComponent } from "./header"
import { PostboxComponent } from "../postbox"
import { TooltipActionContext } from "../../../state/component/tooltip"
import { TimelineComponent } from "./timeline"

export const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        const alpha = 0.95
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

export const ChannelContentComponent = ({ content }: { content: ContentStateT }) => {
    console.debug("ChannelContentComponent::render")
    const tooltipAction = useContext(TooltipActionContext)
    const [theme] = useTheme()
    return (
        <>
            <div className="content-container">
                <div className="content translucent">
                    <div className="menu">
                        <HeaderComponent content={content} />
                    </div>
                    <TimelineComponent content={content} />
                    <div className="postbox">
                        <PostboxComponent content={content} tooltipAction={tooltipAction} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .content-container {
                    flex: 1 1 auto;
                    padding: 8px;
                    display: flex;
                    min-height: 300px;
                }
                .content {
                    width: 100%;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    box-sizing: border-box;
                    border-radius: 10px;
                    position: relative;
                    overflow: hidden;
                    transition-duration: 0.2s;
                }
                .menu {
                    flex: 0 0 auto;
                    z-index: 3;
                }
                .postbox {
                    flex: 0 0 auto;
                    z-index: 2;
                }
            `}</style>
            <style jsx>{`
                .content-container {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .content {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                    border: ${getStyleForTheme(theme)["border"]};
                }
            `}</style>
        </>
    )
}
