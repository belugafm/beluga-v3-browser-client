import React, { useContext } from "react"
import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { HeaderComponent } from "./header"
import { PostboxComponent } from "../postbox"
import { TooltipActionContext } from "../../../state/component/tooltip"
import { TimelineComponent } from "./timeline"

const lerp = (a: number, b: number, ratio: number) => {
    return a * (1 - ratio) + b * ratio
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        const alpha = 0.95
        return {
            color: "#000",
            backgroundColor: "#fff",
            dropShadow: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.05))",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            backgroundColor: "rgba(30, 30, 30, 0.98)",
            dropShadow: "none",
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
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
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
                    filter: ${getStyleForTheme(theme)["dropShadow"]};
                }
                .content {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
            `}</style>
        </>
    )
}
